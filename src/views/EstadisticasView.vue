<script setup>
import { onMounted } from 'vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useEstadisticas } from '../composables/useEstadisticas'
import BarChart from '../components/BarChart.vue'
import DoughnutChart from '../components/DoughnutChart.vue'
import ResumenBarras from '../components/ResumenBarras.vue'

const { transacciones, cargando, errorCarga, obtenerTransacciones } = useTransacciones()



const {
  periodoActivo,
  cambiarPeriodo,
  totalGastos,
  totalIngresos,
  porcentajeAhorro,
  categoriasPrincipal,
  labelsFlujo,
  datosFlujo,
  datosIngresos,
  categoriasDoughnut,
  montosDoughnut,
} = useEstadisticas(transacciones)

onMounted(async () => {
  await obtenerTransacciones()
})
</script>

<template>
  <div class="estadisticas-container">

    <div class="header">
      <div>
        <h1>Estadísticas y Análisis</h1>
        <p>Revisá tu rendimiento financiero y patrones de gasto.</p>
      </div>
      <div class="periodo-selector">
        <button :class="{ activo: periodoActivo === 'mes' }" @click="cambiarPeriodo('mes')">Mes actual</button>
        <button :class="{ activo: periodoActivo === 'trimestre' }" @click="cambiarPeriodo('trimestre')">Últimos 3 meses</button>
        <button :class="{ activo: periodoActivo === 'anio' }" @click="cambiarPeriodo('anio')">Año actual</button>
      </div>
    </div>

    <EstadoDatos :cargando="cargando" :error="errorCarga">
    <div class="cards">
      <div class="card">
        <div class="card-icon-row">
          <span class="card-icon">💸</span>
          <span class="badge badge-gasto"> {{(totalGastos / totalIngresos * 100).toFixed(2)}}%</span>
        </div>
        <p class="card-label">Gasto Total</p>
        <p class="card-valor">${{ totalGastos.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</p>
      </div>

      <div class="card">
        <div class="card-icon-row">
          <span class="card-icon">🛒</span>
        </div>
        <p class="card-label">Categoría Principal</p>
        <div class="card-categoria">
          <span class="card-valor-sm">{{ categoriasPrincipal.nombre || '—' }}</span>
          <span class="card-sub">${{ (categoriasPrincipal.monto || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-icon-row">
          <span class="card-icon">🏦</span>
          <span class="badge badge-ahorro">Objetivo: 20%</span>
        </div>
        <p class="card-label">Promedio de Ahorro</p>
        <div class="card-categoria">
          <span class="card-valor-sm">{{ porcentajeAhorro.toFixed(1) }}%</span>
          <span class="card-sub">del ingreso</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${Math.min((porcentajeAhorro / 20) * 100, 100)}%` }"></div>
        </div>
      </div>
    </div>

    <div class="graficos">
      <div class="grafico-card grafico-grande">
        <div class="grafico-header">
          <div>
            <h3>Flujo de Caja</h3>
            <p>Últimos 6 meses</p>
          </div>
          <div class="leyenda">
            <span class="leyenda-item leyenda-ingreso">Ingresos</span>
            <span class="leyenda-item leyenda-gasto">Gastos</span>
            <span class="leyenda-item leyenda-saldo">Saldo</span>
          </div>
        </div>
        <BarChart :labels="labelsFlujo" :data="datosFlujo" :datosIngresos="datosIngresos" label="Flujo de caja" />
        <!-- <BarChart :labels="labelsFlujo" :data="datosFlujo" label="Flujo de caja" /> -->
      </div>

      
      
      <div class="grafico-card grafico-chico">
        <h3>Desglose de Gastos</h3>
        <p>Distribución por categoría</p>
        <DoughnutChart :labels="categoriasDoughnut" :data="montosDoughnut" />
      </div>
    </div>
    </EstadoDatos>

    <!-- Resumen de barras -->
    <div class="grafico-card">
      <h3>Resumen del período</h3>
      <p>Ingresos, gastos y saldo</p>
      <ResumenBarras :totalIngresos="totalIngresos" :totalGastos="totalGastos" />
    </div>

  </div>
</template>

<style scoped>
.estadisticas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}
.header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Manrope', sans-serif;
}
.header p {
  color: var(--color-text-muted);
  font-size: 14px;
  font-family: 'Work Sans', sans-serif;
}
.periodo-selector {
  display: flex;
  background: var(--color-surface-2);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}
.periodo-selector button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  font-family: 'Work Sans', sans-serif;
  transition: all 0.15s;
}
.periodo-selector button.activo {
  background: var(--color-accent);
  color: var(--color-on-accent);
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.card {
  min-width: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: var(--shadow-card-hover); }
.card-icon-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-icon {
  font-size: 22px;
  background: var(--color-surface-2);
  padding: 8px;
  border-radius: 10px;
}
.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  font-family: 'Work Sans', sans-serif;
}
.badge-gasto { background: var(--color-success-bg); color: var(--color-success); }
.badge-ahorro { background: var(--color-accent-soft); color: var(--color-accent); }
.card-label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: 'Work Sans', sans-serif;
  margin-bottom: 4px;
}
.card-valor {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Manrope', sans-serif;
  margin: 0;
}
.card-categoria { display: flex; align-items: baseline; gap: 8px; }
.card-valor-sm {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Manrope', sans-serif;
}
.card-sub { font-size: 13px; color: var(--color-text-muted); font-family: 'Work Sans', sans-serif; }
.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-surface-2);
  border-radius: 999px;
  margin-top: 12px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
  transition: width 0.6s ease;
}
.graficos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.grafico-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  min-width: 0;
}
.grafico-grande { grid-column: span 2; }
.grafico-chico { grid-column: span 1; }
.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.grafico-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: 'Manrope', sans-serif;
  margin-bottom: 4px;
}
.grafico-card p {
  font-size: 13px;
  color: var(--color-text-muted);
  font-family: 'Work Sans', sans-serif;
  margin-bottom: 16px;
}
.leyenda { display: flex; gap: 16px; }
.leyenda-item {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Work Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
}
.leyenda-item::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.leyenda-ingreso::before { background: #1D9E75; }
.leyenda-gasto::before { background: #D85A30; }
.leyenda-saldo::before { background: #378ADD; }
@media (max-width: 768px) {
  .estadisticas-container { padding: 16px; }
  .header { flex-direction: column; align-items: flex-start; }
  .header h1 { font-size: 24px; }
  .cards { grid-template-columns: 1fr; }
  .graficos { grid-template-columns: 1fr; }
  .grafico-grande, .grafico-chico { grid-column: auto; }
  .periodo-selector { flex-wrap: wrap; width: 100%; }
  .periodo-selector button { flex: 1; white-space: nowrap; }
  .grafico-header { flex-direction: column; gap: 12px; }
}
</style>
