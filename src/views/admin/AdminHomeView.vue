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
    await admin.loadSupervision()
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
    label: 'Usuarios supervisados',
    value: formatNumber(admin.stats.totalUsers),
    icon: 'group',
    accent: 'navy'
  },
  {
    label: 'Movimientos del grupo',
    value: formatNumber(admin.stats.totalTransactions),
    icon: 'swap_horiz',
    accent: 'navy'
  },
  {
    label: 'Ingresos del grupo',
    value: formatCurrency(admin.stats.totalIncome),
    icon: 'account_balance_wallet',
    accent: 'teal'
  },
  {
    label: 'Gastos del grupo',
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
        <p class="scope-title">Grupo supervisado</p>
        <p class="scope-meta">
          {{
            admin.supervisedUsers.length === 0
              ? 'Tu grupo todavía no tiene usuarios. Agregalos desde la pestaña Usuarios.'
              : `Mostrando datos de ${admin.supervisedUsers.length} usuario${admin.supervisedUsers.length === 1 ? '' : 's'}.`
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
            <h2 class="card-title">Actividad del grupo</h2>
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
  background: rgba(0, 106, 97, 0.06);
  border: 1px solid rgba(0, 106, 97, 0.2);
  border-radius: 14px;
}

.scope-banner > .material-symbols-outlined {
  font-size: 28px;
  color: #006a61;
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
  color: #0b1c30;
}

.scope-meta {
  margin: 2px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #45464d;
}

.scope-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #006a61;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.scope-action:hover {
  color: #00554d;
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
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
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
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

.accent-teal {
  background: rgba(0, 106, 97, 0.1);
  color: #006a61;
}

.accent-red {
  background: rgba(186, 26, 26, 0.08);
  color: #ba1a1a;
}

.stat-label {
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #45464d;
}

.stat-value {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #0b1c30;
  letter-spacing: -0.01em;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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
  color: #0b1c30;
}

.card-subtitle {
  margin: 4px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #64748b;
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
  color: #64748b;
  font-size: 14px;
  text-align: center;
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
