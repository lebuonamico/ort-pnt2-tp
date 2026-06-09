<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useCurrency } from '../../composables/useCurrency'
import { useTipoTransaccion } from '../../composables/useTipoTransaccion'
import EstadoDatos from '../../components/EstadoDatos.vue'

const admin = useAdminStore()
const { formatCurrency, formatDate } = useCurrency()
const { esIngreso: isIncome } = useTipoTransaccion()

const page = ref(1)
const pageSize = 25

const filterType = ref('all')
const filterCategoria = ref('')

const cargando = ref(false)

onMounted(async () => {
  cargando.value = true
  try {
    await admin.loadSupervision()
    await Promise.all([
      admin.loadTransactions({ page: page.value, pageSize }),
      admin.loadCategories()
    ])
  } finally {
    cargando.value = false
  }
})

watch(page, (next) => {
  admin.loadTransactions({ page: next, pageSize })
})

const usersById = computed(() => {
  const map = new Map()
  for (const u of admin.supervisedUsers) map.set(u.id, u)
  return map
})

const filteredTransactions = computed(() => {
  return admin.transactions.filter((t) => {
    if (filterType.value === 'ingreso' && !isIncome(t.tipo)) return false
    if (filterType.value === 'gasto' && isIncome(t.tipo)) return false
    if (filterCategoria.value && t.categoria !== filterCategoria.value) return false
    return true
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(admin.transactionsTotal / pageSize))
)

const goToPage = (next) => {
  if (next < 1 || next > totalPages.value) return
  page.value = next
}

const emailFor = (userId) => {
  const u = usersById.value.get(userId)
  return u?.email || `${(userId || '').slice(0, 8)}…`
}
</script>

<template>
  <div class="transactions-view">

    <article class="card">

      <header class="card-header">
        <div>
          <h2 class="card-title">Movimientos del grupo</h2>
          <p class="card-subtitle">
            Movimientos registrados por los usuarios que estás supervisando.
          </p>
        </div>
        <div class="filters">
          <label class="filter">
            <span>Tipo</span>
            <select v-model="filterType">
              <option value="all">Todos</option>
              <option value="ingreso">Ingresos</option>
              <option value="gasto">Gastos</option>
            </select>
          </label>
          <label class="filter">
            <span>Categoría</span>
            <select v-model="filterCategoria">
              <option value="">Todas</option>
              <option
                v-for="cat in admin.categories"
                :key="cat.id"
                :value="cat.nombre"
              >
                {{ cat.nombre }}
              </option>
            </select>
          </label>
        </div>
      </header>

      <EstadoDatos :cargando="cargando">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Concepto</th>
              <th class="cell-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredTransactions.length && !admin.loading">
              <td colspan="6" class="empty-row">
                No hay movimientos para los filtros seleccionados.
              </td>
            </tr>
            <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td class="cell-date">{{ formatDate(tx.fecha) }}</td>
              <td class="cell-email">{{ emailFor(tx.user_id) }}</td>
              <td>
                <span :class="['chip', isIncome(tx.tipo) ? 'chip-income' : 'chip-expense']">
                  {{ isIncome(tx.tipo) ? 'Ingreso' : 'Gasto' }}
                </span>
              </td>
              <td>{{ tx.categoria || '—' }}</td>
              <td class="cell-concept" :title="tx.notas || ''">
                {{ tx.concepto || '—' }}
              </td>
              <td :class="['cell-right', 'cell-amount', isIncome(tx.tipo) ? 'amount-positive' : 'amount-negative']">
                {{ isIncome(tx.tipo) ? '+' : '−' }} {{ formatCurrency(tx.monto) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </EstadoDatos>

      <footer class="table-footer">
        <span class="table-summary">
          Mostrando {{ filteredTransactions.length }} de {{ admin.transactionsTotal }} movimientos
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-button"
            :disabled="page <= 1 || admin.loading"
            @click="goToPage(page - 1)"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="page-indicator">{{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="page-button"
            :disabled="page >= totalPages || admin.loading"
            @click="goToPage(page + 1)"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </footer>

      <p v-if="admin.errors.transactions" class="error-banner">{{ admin.errors.transactions }}</p>

    </article>

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

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #45464d;
}

.filter select {
  border: 2px solid transparent;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 8px 12px;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  color: #0b1c30;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  min-width: 160px;
}

.filter select:focus {
  outline: none;
  border-color: #006a61;
  background: white;
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

.cell-right {
  text-align: right;
}

.cell-date,
.cell-amount {
  font-variant-numeric: tabular-nums;
}

.cell-amount {
  font-weight: 600;
}

.amount-positive { color: #006a61; }
.amount-negative { color: #93000a; }

.cell-email {
  color: #45464d;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-concept {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #45464d;
}

.chip {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
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

.empty-row {
  text-align: center;
  padding: 32px;
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

  .filters {
    width: 100%;
  }

  .filter {
    flex: 1;
  }

  .filter select {
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
