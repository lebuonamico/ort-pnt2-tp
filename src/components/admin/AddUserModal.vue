<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAdminStore } from '../../stores/admin'
import PrimaryButton from '../PrimaryButton.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const admin = useAdminStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('user')
const formError = ref('')

const reset = () => {
  fullName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  role.value = 'user'
  formError.value = ''
  admin.errors.addUser = null
}

const close = () => emit('close')

const onKeydown = (event) => {
  if (event.key === 'Escape' && props.open) close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) reset()
  }
)

const validate = () => {
  if (!fullName.value.trim()) {
    formError.value = 'Nombre completo obligatorio'
    return false
  }
  if (!email.value || !password.value) {
    formError.value = 'Email y contraseña obligatorios'
    return false
  }
  if (password.value.length < 6) {
    formError.value = 'La contraseña debe tener al menos 6 caracteres'
    return false
  }
  if (password.value !== confirmPassword.value) {
    formError.value = 'Las contraseñas no coinciden'
    return false
  }
  formError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validate()) return

  const ok = await admin.createUser({
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    role: role.value
  })

  if (ok) close()
}

const banner = computed(() => formError.value || admin.errors.addUser)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="close">
      <div class="modal-card" role="dialog" aria-modal="true">

        <header class="modal-header">
          <div>
            <h2 class="modal-title">Agregar usuario</h2>
            <p class="modal-subtitle">
              Creá una cuenta nueva en el sistema completando sus datos.
            </p>
          </div>
          <button type="button" class="close-button" @click="close" aria-label="Cerrar">
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <form class="modal-form" @submit.prevent="handleSubmit">

          <p v-if="banner" class="error-banner">{{ banner }}</p>

          <label class="field">
            <span class="field-label">Nombre completo</span>
            <input
              v-model="fullName"
              type="text"
              placeholder="Ej: Juan Pérez"
              :disabled="admin.loading"
            />
          </label>

          <label class="field">
            <span class="field-label">Correo electrónico</span>
            <input
              v-model="email"
              type="email"
              placeholder="nombre@empresa.com"
              :disabled="admin.loading"
            />
          </label>

          <div class="field-row">
            <label class="field">
              <span class="field-label">Contraseña</span>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                :disabled="admin.loading"
              />
            </label>

            <label class="field">
              <span class="field-label">Confirmar contraseña</span>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="••••••••"
                :disabled="admin.loading"
              />
            </label>
          </div>

          <label class="field">
            <span class="field-label">Rol</span>
            <select v-model="role" :disabled="admin.loading">
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div class="modal-actions">
            <PrimaryButton
              variant="outline"
              :fullWidth="false"
              type="button"
              :disabled="admin.loading"
              @click="close"
            >
              Cancelar
            </PrimaryButton>
            <PrimaryButton
              variant="primary"
              :fullWidth="false"
              type="submit"
              :disabled="admin.loading"
            >
              {{ admin.loading ? 'Creando…' : 'Crear usuario' }}
            </PrimaryButton>
          </div>

        </form>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1100;
}

.modal-card {
  background: var(--color-surface);
  border-radius: 16px;
  width: min(520px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card-hover);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-muted);
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease, color 0.2s ease;
}

.close-button:hover {
  background: var(--color-accent-soft);
  color: var(--color-text-primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 24px;
  overflow-y: auto;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.field input,
.field select {
  border: 2px solid transparent;
  background: var(--color-surface-2);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.field select {
  cursor: pointer;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field-row .field {
  flex: 1;
  min-width: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

.error-banner {
  margin: 0;
  padding: 12px 16px;
  border: 1px solid var(--color-danger);
  border-radius: 8px;
  background: var(--color-danger-bg);
  color: var(--color-danger);
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
}

@media (max-width: 640px) {
  .modal-backdrop {
    padding: 12px;
  }

  .modal-header,
  .modal-form {
    padding-left: 16px;
    padding-right: 16px;
  }

  .field-row {
    flex-direction: column;
  }
}
</style>
