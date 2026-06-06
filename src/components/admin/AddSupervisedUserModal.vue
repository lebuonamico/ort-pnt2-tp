<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAdminStore } from '../../stores/admin'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const admin = useAdminStore()
const search = ref('')

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
  async (isOpen) => {
    if (isOpen) {
      search.value = ''
      admin.errors.addUser = null
      // Asegurar que conocemos el grupo + el admin actual antes de listar candidatos
      if (admin.currentAdminId === null) await admin.loadSupervision()
      admin.loadAllUsers()
    }
  }
)

const filteredCandidates = computed(() => {
  const term = search.value.trim().toLowerCase()
  const candidates = admin.availableUsers
  if (!term) return candidates
  return candidates.filter((u) =>
    (u.email || '').toLowerCase().includes(term) ||
    (u.id || '').toLowerCase().includes(term)
  )
})

const initials = (u) => {
  const source = u.email || u.id || '?'
  return source.slice(0, 2).toUpperCase()
}

const handleAdd = async (user) => {
  await admin.addToSupervision(user.id)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="close">
      <div class="modal-card" role="dialog" aria-modal="true">

        <header class="modal-header">
          <div>
            <h2 class="modal-title">Agregar usuario al grupo</h2>
            <p class="modal-subtitle">
              Seleccioná un usuario para incorporarlo a tu grupo supervisado.
            </p>
          </div>
          <button type="button" class="close-button" @click="close" aria-label="Cerrar">
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input
            v-model="search"
            type="search"
            placeholder="Buscar por email…"
            autofocus
          />
        </div>

        <div class="candidates">

          <p v-if="admin.errors.addUser" class="error-banner">
            {{ admin.errors.addUser }}
          </p>

          <p v-if="admin.errors.allUsers" class="error-banner">
            {{ admin.errors.allUsers }}
          </p>

          <p v-if="!admin.errors.allUsers && filteredCandidates.length === 0" class="empty-state">
            {{
              admin.allUsers.length === 0
                ? 'No hay usuarios para mostrar.'
                : search
                  ? 'Ningún usuario coincide con la búsqueda.'
                  : 'Ya agregaste a todos los usuarios disponibles.'
            }}
          </p>

          <ul v-if="filteredCandidates.length > 0" class="candidate-list">
            <li
              v-for="user in filteredCandidates"
              :key="user.id"
              class="candidate-row"
            >
              <div class="avatar">{{ initials(user) }}</div>
              <div class="candidate-info">
                <span class="candidate-email">{{ user.email || 'Sin email' }}</span>
                <span class="candidate-meta">
                  {{ user.role === 'admin' ? 'Admin' : 'Usuario' }}
                  · {{ user.id.slice(0, 8) }}…
                </span>
              </div>
              <button
                type="button"
                class="add-button"
                :disabled="admin.loading"
                @click="handleAdd(user)"
              >
                <span class="material-symbols-outlined">add</span>
                Agregar
              </button>
            </li>
          </ul>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1100;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: min(520px, 100%);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(198, 198, 205, 0.4);
}

.modal-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0b1c30;
}

.modal-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #64748b;
}

.close-button {
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
  flex-shrink: 0;
  transition: background 0.2s ease, color 0.2s ease;
}

.close-button:hover {
  background: rgba(15, 23, 42, 0.06);
  color: #0b1c30;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 24px 0;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 999px;
  padding: 8px 16px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.search-box:focus-within {
  border-color: #006a61;
  background: white;
}

.search-box .material-symbols-outlined {
  font-size: 20px;
  color: #64748b;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  color: #0b1c30;
  width: 100%;
}

.candidates {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 20px;
}

.candidate-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.candidate-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(198, 198, 205, 0.5);
  border-radius: 12px;
  background: #ffffff;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.candidate-row:hover {
  border-color: #006a61;
  background: rgba(0, 106, 97, 0.03);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: rgba(134, 242, 228, 0.5);
  color: #006a61;
  font-family: 'Work Sans', sans-serif;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.candidate-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.candidate-email {
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #0b1c30;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.candidate-meta {
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  color: #64748b;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #006a61;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.add-button:hover:not(:disabled) {
  background: #00554d;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button .material-symbols-outlined {
  font-size: 18px;
}

.empty-state {
  margin: 24px 0;
  text-align: center;
  font-family: 'Work Sans', sans-serif;
  color: #64748b;
  font-size: 14px;
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
  .modal-backdrop {
    padding: 12px;
  }

  .modal-header,
  .candidates {
    padding-left: 16px;
    padding-right: 16px;
  }

  .search-box {
    margin-left: 16px;
    margin-right: 16px;
  }
}
</style>
