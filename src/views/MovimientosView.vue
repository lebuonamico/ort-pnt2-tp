<script setup>
import { onMounted } from 'vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useMovimientos } from '../composables/useMovimientos'
import FiltrosMovimientos from '../components/FiltrosMovimientos.vue'
import Paginacion from '../components/Paginacion.vue'
import FilaMovimiento from '../components/FilaMovimiento.vue'

const { transacciones, obtenerTransacciones } = useTransacciones()

const {
  busqueda, filtroFecha, filtroCategoria, filtroTipo, categorias,
  paginaActual, porPagina, totalPaginas,
  transaccionesFiltradas, transaccionesPaginadas,
  formatearFecha, formatearMonto, cambiarPagina,
} = useMovimientos(transacciones)

onMounted(() => obtenerTransacciones())
</script>

<template>
  <div class="movimientos">
    <h2>Movimientos</h2>
    <p class="subtitulo">Consultá y gestioná tu historial de transacciones detallado.</p>

    <FiltrosMovimientos
      v-model:busqueda="busqueda"
      v-model:filtroFecha="filtroFecha"
      v-model:filtroCategoria="filtroCategoria"
      v-model:filtroTipo="filtroTipo"
      :categorias="categorias"
    />

    <table class="tabla">
      <thead>
        <tr>
          <th>FECHA</th>
          <th>CONCEPTO</th>
          <th>CATEGORÍA</th>
          <th>MONTO</th>
        </tr>
      </thead>
      <tbody>
        <FilaMovimiento
          v-for="t in transaccionesPaginadas"
          :key="t.id"
          :transaccion="t"
          :formatearFecha="formatearFecha"
          :formatearMonto="formatearMonto"
        />
      </tbody>
    </table>

    <Paginacion
      :paginaActual="paginaActual"
      :totalPaginas="totalPaginas"
      :totalItems="transaccionesFiltradas.length"
      :porPagina="porPagina"
      @cambiar="cambiarPagina"
    />
  </div>
</template>

<style scoped>
.movimientos {
  padding: 40px 32px;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.subtitulo {
  color: #64748b;
  margin-bottom: 24px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  font-size: 12px;
  color: #94a3b8;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .movimientos {
    padding: 16px;
  }

  .tabla {
    font-size: 12px;
  }

  thead th:nth-child(1) {
    display: none;
  }
}
</style>