<script setup>
import { ref, onMounted } from 'vue'
import NuevaTransaccion from '../components/NuevaTransaccion.vue'
import Card from '../components/Card.vue'
import ListaMovimientos from '../components/ListaMovimientos.vue'
import GraficoGastos from '../components/GraficoGastos.vue'
import EstadoDatos from '../components/EstadoDatos.vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useCategories } from '../composables/useCategories'
import { useFechas } from '../composables/useFechas'
import iconoSaldo from '../assets/1.png'
import iconoIngresos from '../assets/2.png'
import iconoGastos from '../assets/3.png'

const mostrarModal = ref(false)

const {
  transacciones,
  cargando,
  errorCarga,
  obtenerTransacciones,
  saldoTotal,
  ingresosMes,
  gastosMes,
  porcentajeCambioSaldo,
  porcentajeCambioIngresos,
  porcentajeCambioGastos,
} = useTransacciones()

const { cargarCategorias } = useCategories()
const { fechaLarga } = useFechas()

const fechaHoy = fechaLarga()

onMounted(async () => {
  await Promise.all([obtenerTransacciones(), cargarCategorias()])
})

function handleGuardado() {
  mostrarModal.value = false
  obtenerTransacciones()
}
</script>

<template>
  <div class="app-page">

    <header class="app-page-header">
      <div class="app-page-header-inner header-row">
        <div>
          <p class="app-eyebrow">Finanzas Pro</p>
          <h1 class="app-page-title">Resumen General</h1>
          <p class="app-page-subtitle">Actualizado al {{ fechaHoy }}</p>
        </div>
        <button class="btn-nueva" @click="mostrarModal = true">
          <span class="material-symbols-outlined">add</span>
          Nueva transacción
        </button>
      </div>
    </header>

    <div class="app-page-content">

      <EstadoDatos :cargando="cargando" :error="errorCarga">
        <div class="stats-grid">
          <Card titulo="Saldo total" :monto="saldoTotal" :imagen="iconoSaldo" :variacion="porcentajeCambioSaldo" />
          <Card titulo="Ingresos del mes" :monto="ingresosMes" :imagen="iconoIngresos" :variacion="porcentajeCambioIngresos" />
          <Card titulo="Gastos del mes" :monto="gastosMes" :imagen="iconoGastos" :variacion="porcentajeCambioGastos" :invertirVariacion="true" />
        </div>

        <div class="contenido">
          <div class="grafico app-card">
            <GraficoGastos :transacciones="transacciones" />
          </div>
          <ListaMovimientos :transacciones="transacciones" />
        </div>
      </EstadoDatos>

    </div>

    <NuevaTransaccion
      :show="mostrarModal"
      @close="mostrarModal = false"
      @saved="handleGuardado"
    />

  </div>
</template>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.btn-nueva {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.btn-nueva:hover { background: #00554d; }

.btn-nueva .material-symbols-outlined { font-size: 18px; }

.stats-grid,
.contenido {
  display: contents;
}

.app-page-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 16px;
}

.app-page-content :deep(.estado-datos) {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.grafico {
  grid-column: 1 / 3;
  grid-row: 2;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}


.grafico :deep(.grafico-container) {
  flex: 1;
  min-height: 0;
}

.app-page {
  height: calc(100vh - var(--navbar-height));
  overflow: hidden;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .app-page-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;
  }
  .grafico { grid-column: 1; grid-row: 4; }
}

@media (max-width: 768px) {
  .header-row { flex-direction: column; align-items: flex-start; }
}
</style>
