<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useCurrency } from '../../composables/useCurrency'
import PrimaryButton from '../../components/PrimaryButton.vue'
import AddSupervisedUserModal from '../../components/admin/AddSupervisedUserModal.vue'

const admin = useAdminStore()
const { formatDate } = useCurrency()

const search = ref('')
const page = ref(1)
const pageSize = 20
const modalOpen = ref(false)

onMounted(() => {
  admin.loadSupervision()
})

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return admin.supervisedUsers
  return admin.supervisedUsers.filter((u) =>
    (u.email || '').toLowerCase().includes(term) ||
    (u.id || '').toLowerCase().includes(term)
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredUsers.value.length / pageSize))
)

const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const initials = (u) => {
  const source = u.email || u.id || '?'
  return source.slice(0, 2).toUpperCase()
}

const goToPage = (next) => {
  if (next < 1 || next > totalPages.value) return
  page.value = next
}

const toggleStatus = async (user) => {
  await admin.toggleUserStatus(user.id, user.status || 'active')
}

const removeFromGroup = async (user) => {
  const label = user.email || user.id
  const ok = window.confirm(`¿Quitar a ${label} del grupo supervisado?`)
  if (!ok) return
  await admin.removeFromSupervision(user.id)
}
</script>

<template>
  <div class="users-view">

    <article class="card">

      <header class="card-header">
        <div>
          <h2 class="card-title">Grupo supervisado</h2>
          <p class="card-subtitle">
            Usuarios que vas a ver reflejados en las estadísticas y movimientos del panel.
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
                  <p class="empty-title">Tu grupo todavía no tiene usuarios</p>
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
                  <button
                    type="button"
                    class="icon-button icon-button-danger"
                    title="Quitar del grupo"
                    :disabled="admin.loading"
                    @click="removeFromGroup(user)"
                  >
                    <span class="material-symbols-outlined">person_remove</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

      <p v-if="admin.errors.supervision" class="error-banner">{{ admin.errors.supervision }}</p>
      <p v-if="admin.errors.removeUser" class="error-banner">{{ admin.errors.removeUser }}</p>

    </article>

    <AddSupervisedUserModal :open="modalOpen" @close="modalOpen = false" />

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.card {
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid rgba(198, 198, 205, 0.4);
  flex-wrap: wrap;
}

.card-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0b1c30;
}

.card-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #64748b;
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
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 999px;
  padding: 8px 16px;
  min-width: 260px;
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

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Work Sans', sans-serif;
}

.data-table thead tr {
  background: rgba(229, 238, 255, 0.4);
}

.data-table th {
  text-align: left;
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid rgba(198, 198, 205, 0.4);
}

.data-table tbody tr {
  border-bottom: 1px solid rgba(198, 198, 205, 0.25);
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: rgba(248, 249, 255, 0.6);
}

.data-table td {
  padding: 14px 20px;
  font-size: 14px;
  color: #0b1c30;
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
  background: rgba(134, 242, 228, 0.5);
  color: #006a61;
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
  color: #0b1c30;
}

.user-id {
  font-size: 12px;
  color: #64748b;
}

.cell-date {
  color: #45464d;
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
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.chip-user {
  background: rgba(0, 106, 97, 0.1);
  color: #006a61;
}

.chip-active {
  background: rgba(134, 242, 228, 0.4);
  color: #006a61;
}

.chip-suspended {
  background: rgba(186, 26, 26, 0.1);
  color: #93000a;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.action-button {
  background: transparent;
  border: 1px solid #c6c6cd;
  color: #0f172a;
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
  border: 1px solid #c6c6cd;
  border-radius: 8px;
  background: white;
  color: #64748b;
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
  background: rgba(186, 26, 26, 0.08);
  border-color: #ba1a1a;
  color: #93000a;
}

.action-button:hover:not(:disabled) {
  background: rgba(0, 106, 97, 0.06);
  border-color: #006a61;
  color: #006a61;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-row {
  text-align: center;
  padding: 40px 24px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  color: #c6c6cd;
  display: block;
}

.empty-title {
  margin: 12px 0 4px;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0b1c30;
}

.empty-hint {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #64748b;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(198, 198, 205, 0.4);
  background: rgba(248, 249, 255, 0.4);
  font-family: 'Work Sans', sans-serif;
}

.table-summary {
  font-size: 13px;
  color: #64748b;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-button {
  width: 32px;
  height: 32px;
  border: 1px solid #c6c6cd;
  border-radius: 8px;
  background: white;
  color: #45464d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.page-button:hover:not(:disabled) {
  background: rgba(0, 106, 97, 0.06);
  color: #006a61;
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
  color: #0b1c30;
  padding: 0 4px;
}

.error-banner {
  margin: 16px 24px;
  padding: 12px 16px;
  border: 1px solid #ffb4ab;
  border-radius: 8px;
  background: #ffdad6;
  color: #93000a;
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
