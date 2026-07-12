<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminStore } from '../../stores/admin'
import { useCurrency } from '../../composables/useCurrency'
import BarChart from '../../components/admin/BarChart.vue'
import DoughnutChart from '../../components/admin/DoughnutChart.vue'
import EstadoDatos from '../../components/EstadoDatos.vue'

const admin = useAdminStore()
const { formatCurrency, formatNumber } = useCurrency()

const cargando = ref(false)

onMounted(async () => {
  cargando.value = true
  try {
    await admin.loadAllUsers()
    await Promise.all([
      admin.loadStats(),
      admin.loadMonthlyActivity(),
      admin.loadCategoryDistribution()
    ])
  } finally {
    cargando.value = false
  }
})

const statCards = computed(() => [
  {
    label: 'Usuarios del sistema',
    value: formatNumber(admin.stats.totalUsers),
    icon: 'group',
    accent: 'navy'
  },
  {
    label: 'Movimientos totales',
    value: formatNumber(admin.stats.totalTransactions),
    icon: 'swap_horiz',
    accent: 'navy'
  },
  {
    label: 'Ingresos totales',
    value: formatCurrency(admin.stats.totalIncome),
    icon: 'account_balance_wallet',
    accent: 'teal'
  },
  {
    label: 'Gastos totales',
    value: formatCurrency(admin.stats.totalExpenses),
    icon: 'payments',
    accent: 'red'
  }
])

const monthlyLabels = computed(() =>
  admin.monthlyActivity.map((m) => m.label)
)

const monthlyValues = computed(() =>
  admin.monthlyActivity.map((m) => m.count)
)

const distributionLabels = computed(() =>
  admin.categoryDistribution.slice(0, 8).map((c) => c.categoria)
)

const distributionValues = computed(() =>
  admin.categoryDistribution.slice(0, 8).map((c) => c.total)
)

const hasMonthlyData = computed(() => monthlyValues.value.some((v) => v > 0))
const hasDistributionData = computed(() => distributionValues.value.length > 0)

const homeError = computed(() =>
  admin.errors.stats ||
  admin.errors.monthlyActivity ||
  admin.errors.categoryDistribution
)
</script>

<template>
  <div class="home-view">

    <section class="scope-banner">
      <span class="material-symbols-outlined">visibility</span>
      <div>
        <p class="scope-title">Usuarios del sistema</p>
        <p class="scope-meta">
          {{
            admin.allUsers.length === 0
              ? 'Todavía no hay usuarios en el sistema. Agregalos desde la pestaña Usuarios.'
              : `Mostrando datos de ${admin.allUsers.length} usuario${admin.allUsers.length === 1 ? '' : 's'}.`
          }}
        </p>
      </div>
      <RouterLink :to="{ name: 'admin-usuarios' }" class="scope-action">
        Gestionar
        <span class="material-symbols-outlined">arrow_forward</span>
      </RouterLink>
    </section>

    <EstadoDatos :cargando="cargando">
    <section class="stats-grid">
      <article
        v-for="card in statCards"
        :key="card.label"
        class="stat-card"
      >
        <div :class="['stat-icon', `accent-${card.accent}`]">
          <span class="material-symbols-outlined">{{ card.icon }}</span>
        </div>
        <p class="stat-label">{{ card.label }}</p>
        <p class="stat-value">{{ card.value }}</p>
      </article>
    </section>

    <section class="charts-grid">

      <article class="card chart-card chart-card-wide">
        <header class="card-header">
          <div>
            <h2 class="card-title">Actividad del sistema</h2>
            <p class="card-subtitle">Volumen de transacciones mensuales (últimos 12 meses)</p>
          </div>
        </header>
        <div class="chart-body">
          <BarChart
            v-if="hasMonthlyData"
            :labels="monthlyLabels"
            :data="monthlyValues"
            label="Movimientos"
          />
          <p v-else class="empty-state">
            Aún no hay movimientos registrados para graficar.
          </p>
        </div>
      </article>

      <article class="card chart-card">
        <header class="card-header">
          <div>
            <h2 class="card-title">Distribución por Categoría</h2>
            <p class="card-subtitle">Suma de gastos por categoría</p>
          </div>
        </header>
        <div class="chart-body">
          <DoughnutChart
            v-if="hasDistributionData"
            :labels="distributionLabels"
            :data="distributionValues"
          />
          <p v-else class="empty-state">
            Aún no hay gastos categorizados.
          </p>
        </div>
      </article>

    </section>
    </EstadoDatos>

    <p v-if="homeError" class="error-banner">
      {{ homeError }}
    </p>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.scope-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent-soft);
  border-radius: 14px;
}

.scope-banner > .material-symbols-outlined {
  font-size: 28px;
  color: var(--color-accent);
  flex-shrink: 0;
}

.scope-banner > div {
  flex: 1;
  min-width: 0;
}

.scope-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.scope-meta {
  margin: 2px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.scope-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.scope-action:hover {
  color: var(--color-accent-hover);
}

.scope-action .material-symbols-outlined {
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .material-symbols-outlined {
  font-size: 24px;
}

.accent-navy {
  background: var(--color-surface-2);
  color: var(--color-text-primary);
}

.accent-teal {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.accent-red {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.stat-label {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.stat-value {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
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

.chart-body {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
