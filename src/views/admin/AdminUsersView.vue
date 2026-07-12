<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useCurrency } from '../../composables/useCurrency'
import { useBusqueda } from '../../composables/useBusqueda'
import { usePagination } from '../../composables/usePagination'
import PrimaryButton from '../../components/PrimaryButton.vue'
import AddUserModal from '../../components/admin/AddUserModal.vue'
import EstadoDatos from '../../components/EstadoDatos.vue'

const admin = useAdminStore()
const { formatDate } = useCurrency()

const modalOpen = ref(false)
const cargando = ref(false)

const { termino: search, resultados: filteredUsers } = useBusqueda(
  computed(() => admin.allUsers),
  ['email', 'id']
)
const { paginaActual: page, totalPaginas, itemsPaginados: pageItems, cambiarPagina: goToPage } =
  usePagination(filteredUsers, 20)
const totalPages = computed(() => Math.max(1, totalPaginas.value))

onMounted(async () => {
  cargando.value = true
  try {
    await admin.loadAllUsers()
  } finally {
    cargando.value = false
  }
})

const initials = (u) => {
  const source = u.email || u.id || '?'
  return source.slice(0, 2).toUpperCase()
}

const toggleStatus = async (user) => {
  await admin.toggleUserStatus(user.id, user.status || 'active')
}
</script>

<template>
  <div class="users-view">

    <article class="card">

      <header class="card-header">
        <div>
          <h2 class="card-title">Usuarios del sistema</h2>
          <p class="card-subtitle">
            Todos los usuarios registrados, reflejados en las estadísticas y movimientos del panel.
          </p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="search"
              type="search"
              placeholder="Buscar por email…"
              @input="page = 1"
            />
          </div>
          <PrimaryButton
            variant="primary"
            :fullWidth="false"
            @click="modalOpen = true"
          >
            + Agregar usuario
          </PrimaryButton>
        </div>
      </header>

      <EstadoDatos :cargando="cargando">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha de Ingreso</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!pageItems.length && !admin.loading">
              <td colspan="5" class="empty-row">
                <template v-if="search">Sin resultados para esa búsqueda.</template>
                <template v-else>
                  <span class="material-symbols-outlined empty-icon">group_add</span>
                  <p class="empty-title">Todavía no hay usuarios en el sistema</p>
                  <p class="empty-hint">Empezá agregando alguno con el botón de arriba.</p>
                </template>
              </td>
            </tr>
            <tr v-for="user in pageItems" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ initials(user) }}</div>
                  <div class="user-info">
                    <span class="user-email">{{ user.email || 'Sin email' }}</span>
                    <span class="user-id">{{ user.id.slice(0, 8) }}…</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['chip', user.role === 'admin' ? 'chip-admin' : 'chip-user']">
                  {{ user.role === 'admin' ? 'Admin' : 'Usuario' }}
                </span>
              </td>
              <td>
                <span :class="['chip', (user.status || 'active') === 'active' ? 'chip-active' : 'chip-suspended']">
                  {{ (user.status || 'active') === 'active' ? 'Activo' : 'Suspendido' }}
                </span>
              </td>
              <td class="cell-date">{{ formatDate(user.created_at) }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button
                    type="button"
                    class="action-button"
                    :disabled="admin.loading"
                    @click="toggleStatus(user)"
                  >
                    {{ (user.status || 'active') === 'active' ? 'Suspender' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </EstadoDatos>

      <footer class="table-footer">
        <span class="table-summary">
          Mostrando {{ pageItems.length }} de {{ filteredUsers.length }} usuarios
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-button"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="page-indicator">{{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="page-button"
            :disabled="page >= totalPages"
            @click="goToPage(page + 1)"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </footer>

      <p v-if="admin.errors.allUsers" class="error-banner">{{ admin.errors.allUsers }}</p>

    </article>

    <AddUserModal :open="modalOpen" @close="modalOpen = false" />

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.card-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.card-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-surface-2);
  border: 2px solid transparent;
  border-radius: 999px;
  padding: 8px 16px;
  min-width: 260px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.search-box .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-text-muted);
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text-primary);
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Work Sans', sans-serif;
}

.data-table thead tr {
  background: var(--color-surface-2);
}

.data-table th {
  text-align: left;
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: var(--color-surface-2);
}

.data-table td {
  padding: 14px 20px;
  font-size: 14px;
  color: var(--color-text-primary);
  vertical-align: middle;
}

.col-actions {
  text-align: right;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-email {
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-id {
  font-size: 12px;
  color: var(--color-text-muted);
}

.cell-date {
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.chip-admin {
  background: var(--color-surface-2);
  color: var(--color-text-primary);
}

.chip-user {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.chip-active {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.chip-suspended {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.action-button {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 6px 14px;
  border-radius: 8px;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-button .material-symbols-outlined {
  font-size: 18px;
}

.icon-button-danger:hover:not(:disabled) {
  background: var(--color-danger-bg);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.action-button:hover:not(:disabled) {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-row {
  text-align: center;
  padding: 40px 24px;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  color: var(--color-text-muted);
  display: block;
}

.empty-title {
  margin: 12px 0 4px;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.empty-hint {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-muted);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-family: 'Work Sans', sans-serif;
}

.table-summary {
  font-size: 13px;
  color: var(--color-text-muted);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.page-button:hover:not(:disabled) {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-button .material-symbols-outlined {
  font-size: 18px;
}

.page-indicator {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  padding: 0 4px;
}

.error-banner {
  margin: 16px 24px;
  padding: 12px 16px;
  border: 1px solid var(--color-danger);
  border-radius: 8px;
  background: var(--color-danger-bg);
  color: var(--color-danger);
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
}

@media (max-width: 640px) {
  .card-header {
    padding: 16px;
  }

  .search-box {
    min-width: 0;
    width: 100%;
  }

  .data-table th,
  .data-table td {
    padding: 12px 14px;
    font-size: 13px;
  }
}
</style>
