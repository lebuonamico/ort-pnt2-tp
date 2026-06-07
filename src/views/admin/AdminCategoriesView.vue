<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useCategoryImage } from '../../composables/useCategoryImage'
import PrimaryButton from '../../components/PrimaryButton.vue'
import AuthInputGroup from '../../components/AuthInputGroup.vue'

const admin = useAdminStore()
const { categoryImageUrl } = useCategoryImage()

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

const showForm = ref(false)
const editingId = ref(null)
const fileInput = ref(null)
const imageError = ref('')
const uploading = ref(false)

const sessionUploads = ref([])
const originalImagePath = ref('')

const form = reactive({
  nombre: '',
  tipo: 'gasto',
  imagen_path: '',
  descripcion: ''
})

onMounted(() => {
  admin.loadCategories()
})

const formImageUrl = computed(() => categoryImageUrl(form.imagen_path))

const resetForm = () => {
  form.nombre = ''
  form.tipo = 'gasto'
  form.imagen_path = ''
  form.descripcion = ''
  editingId.value = null
  imageError.value = ''
  sessionUploads.value = []
  originalImagePath.value = ''
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (category) => {
  resetForm()
  editingId.value = category.id
  form.nombre = category.nombre
  form.tipo = category.tipo
  form.imagen_path = category.imagen_path || ''
  form.descripcion = category.descripcion || ''
  originalImagePath.value = category.imagen_path || ''
  showForm.value = true
}

const cancel = () => {
  admin.removeCategoryImages(sessionUploads.value)
  showForm.value = false
  resetForm()
}

const triggerFilePicker = () => {
  imageError.value = ''
  fileInput.value?.click()
}

const onFileSelected = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    imageError.value = 'El archivo debe ser una imagen.'
    return
  }
  if (file.size > MAX_IMAGE_BYTES) {
    imageError.value = 'La imagen no puede superar los 2 MB.'
    return
  }

  uploading.value = true
  try {
    const result = await admin.uploadCategoryImage(file)
    if (!result) return
    sessionUploads.value.push(result.path)
    form.imagen_path = result.path
    imageError.value = ''
  } finally {
    uploading.value = false
  }
}

const removeImage = () => {
  form.imagen_path = ''
}

const submit = async () => {
  const payload = {
    nombre: form.nombre.trim(),
    tipo: form.tipo,
    imagen_path: form.imagen_path || null,
    descripcion: form.descripcion.trim() || null
  }

  if (!payload.nombre) return

  const result = editingId.value
    ? await admin.updateCategory(editingId.value, payload)
    : await admin.createCategory(payload)

  if (result) {
    const orphans = sessionUploads.value.filter((p) => p !== form.imagen_path)
    if (originalImagePath.value && originalImagePath.value !== form.imagen_path) {
      orphans.push(originalImagePath.value)
    }
    admin.removeCategoryImages(orphans)

    showForm.value = false
    resetForm()
  }
}

const confirmDelete = async (category) => {
  const ok = window.confirm(`¿Eliminar la categoría "${category.nombre}"? Esta acción no se puede deshacer.`)
  if (!ok) return
  await admin.deleteCategory(category.id)
}
</script>

<template>
  <div class="categories-view">

    <header class="section-header">
      <div>
        <h2 class="section-title">Gestión de Categorías</h2>
        <p class="section-subtitle">
          Define las etiquetas globales que los usuarios usarán para clasificar sus movimientos.
        </p>
      </div>
      <PrimaryButton
        variant="primary"
        :fullWidth="false"
        @click="openCreate"
      >
        + Añadir categoría
      </PrimaryButton>
    </header>

    <section v-if="showForm" class="card form-card">
      <h3 class="form-title">
        {{ editingId ? 'Editar categoría' : 'Nueva categoría' }}
      </h3>

      <form class="category-form" @submit.prevent="submit">

        <div class="form-row">
          <AuthInputGroup
            v-model="form.nombre"
            label="Nombre"
            id="cat-nombre"
            placeholder="Alimentación, Transporte…"
            icon="label"
          />
        </div>

        <div class="form-row form-row-split">

          <div class="type-field">
            <span class="field-label">Tipo</span>
            <div class="type-options">
              <label :class="['type-option', { active: form.tipo === 'gasto' }]">
                <input v-model="form.tipo" type="radio" value="gasto" />
                <span class="material-symbols-outlined">trending_down</span>
                Gasto
              </label>
              <label :class="['type-option', { active: form.tipo === 'ingreso' }]">
                <input v-model="form.tipo" type="radio" value="ingreso" />
                <span class="material-symbols-outlined">trending_up</span>
                Ingreso
              </label>
            </div>
          </div>

          <div class="image-field">
            <span class="field-label">Imagen de la categoría</span>
            <div class="image-field-controls">
              <div class="image-preview">
                <img v-if="formImageUrl" :src="formImageUrl" alt="Imagen de la categoría" />
                <span v-else class="material-symbols-outlined">image</span>
              </div>
              <div class="image-buttons">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="visually-hidden"
                  @change="onFileSelected"
                />
                <PrimaryButton
                  variant="outline"
                  :fullWidth="false"
                  type="button"
                  :disabled="uploading"
                  @click="triggerFilePicker"
                >
                  {{ uploading ? 'Subiendo…' : (form.imagen_path ? 'Cambiar imagen' : 'Subir imagen') }}
                </PrimaryButton>
                <button
                  v-if="form.imagen_path"
                  type="button"
                  class="image-remove"
                  :disabled="uploading"
                  @click="removeImage"
                >
                  Quitar imagen
                </button>
              </div>
            </div>
            <p v-if="imageError" class="image-error">{{ imageError }}</p>
          </div>
        </div>

        <div class="form-row">
          <AuthInputGroup
            v-model="form.descripcion"
            label="Descripción (opcional)"
            id="cat-descripcion"
            placeholder="Una breve descripción de la categoría"
            icon="notes"
          />
        </div>

        <div class="form-actions">
          <PrimaryButton
            variant="outline"
            :fullWidth="false"
            type="button"
            @click="cancel"
          >
            Cancelar
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            :fullWidth="false"
            type="submit"
            :disabled="admin.loading || !form.nombre.trim()"
          >
            {{ editingId ? 'Guardar cambios' : 'Crear categoría' }}
          </PrimaryButton>
        </div>

      </form>
    </section>

    <p v-if="admin.errors.categories" class="error-banner">{{ admin.errors.categories }}</p>

    <section
      v-if="admin.categories.length"
      class="categories-grid"
    >
      <article
        v-for="cat in admin.categories"
        :key="cat.id"
        class="category-card"
      >
        <div :class="['category-icon', cat.tipo === 'ingreso' ? 'icon-income' : 'icon-expense']">
          <img
            v-if="cat.imagen_path"
            :src="categoryImageUrl(cat.imagen_path)"
            :alt="cat.nombre"
            class="category-image"
          />
          <span v-else class="material-symbols-outlined">image</span>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ cat.nombre }}</h3>
          <p class="category-meta">
            <span :class="['chip', cat.tipo === 'ingreso' ? 'chip-income' : 'chip-expense']">
              {{ cat.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
            </span>
            <span v-if="cat.descripcion" class="category-desc">{{ cat.descripcion }}</span>
          </p>
        </div>
        <div class="category-actions">
          <button
            type="button"
            class="icon-button"
            title="Editar"
            @click="openEdit(cat)"
          >
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button
            type="button"
            class="icon-button icon-button-danger"
            title="Eliminar"
            @click="confirmDelete(cat)"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </article>
    </section>

    <section v-else-if="!admin.loading" class="card empty-card">
      <span class="material-symbols-outlined empty-icon">category</span>
      <h3>Todavía no hay categorías</h3>
      <p>Creá la primera categoría para que los usuarios puedan clasificar sus movimientos.</p>
    </section>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.categories-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #0b1c30;
}

.section-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  color: #64748b;
  max-width: 560px;
}

.card {
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.form-card {
  border-color: rgba(0, 106, 97, 0.4);
  box-shadow: 0 8px 24px rgba(0, 106, 97, 0.06);
}

.form-title {
  margin: 0 0 16px;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0b1c30;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: end;
}

.type-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.image-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-field-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.image-preview {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  background: #f1f5f9;
  border: 1px solid #c6c6cd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #94a3b8;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview .material-symbols-outlined {
  font-size: 22px;
}

.image-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.image-remove {
  border: none;
  background: transparent;
  color: #93000a;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.image-remove:hover:not(:disabled) {
  background: rgba(186, 26, 26, 0.08);
}

.image-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-error {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #93000a;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.type-options {
  display: flex;
  gap: 12px;
}

.type-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 14px;
  border: 2px solid transparent;
  background: #f1f5f9;
  border-radius: 14px;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #45464d;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.type-option input { display: none; }

.type-option .material-symbols-outlined { font-size: 18px; }

.type-option.active {
  border-color: #006a61;
  background: white;
  color: #006a61;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.category-card {
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.category-card:hover {
  border-color: #006a61;
  box-shadow: 0 8px 24px rgba(0, 106, 97, 0.08);
  transform: translateY(-2px);
}

.category-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.icon-expense {
  background: rgba(186, 26, 26, 0.08);
  color: #93000a;
}

.icon-income {
  background: rgba(134, 242, 228, 0.4);
  color: #006a61;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0b1c30;
}

.category-meta {
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-desc {
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  color: #64748b;
}

.chip {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.chip-income {
  background: rgba(134, 242, 228, 0.4);
  color: #006a61;
}

.chip-expense {
  background: rgba(186, 26, 26, 0.1);
  color: #93000a;
}

.category-actions {
  display: flex;
  gap: 4px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background: rgba(0, 106, 97, 0.06);
  color: #006a61;
}

.icon-button-danger:hover {
  background: rgba(186, 26, 26, 0.08);
  color: #93000a;
}

.icon-button .material-symbols-outlined { font-size: 18px; }

.empty-card {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-card h3 {
  margin: 8px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  color: #0b1c30;
}

.empty-card p {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  color: #64748b;
  font-size: 14px;
}

.empty-icon {
  font-size: 48px;
  color: #c6c6cd;
}

.error-banner {
  margin: 0;
  padding: 12px 16px;
  border: 1px solid #ffb4ab;
  border-radius: 8px;
  background: #ffdad6;
  color: #93000a;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
}

@media (max-width: 640px) {
  .form-row-split {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions :deep(.primary-button) {
    width: 100%;
  }
}
</style>
