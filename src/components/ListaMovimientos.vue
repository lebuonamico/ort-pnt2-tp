<script setup>
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import Movimiento from './Movimiento.vue'
import Paginacion from './Paginacion.vue'
import { usePagination } from '../composables/usePagination'

const router = useRouter()

const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  }
})

const { paginaActual, porPagina, totalPaginas, itemsPaginados, cambiarPagina } =
  usePagination(toRef(props, 'transacciones'), 3)
</script>

<template>
  <div class="app-card lista-movimientos">
    <div class="lista-header">
      <h3>Movimientos</h3>
      <button class="btn-ver-todos" @click="router.push('/movimientos')">Ver todos</button>
    </div>

    <div class="movimientos-area">
      <Movimiento
        v-for="transaccion in itemsPaginados"
        :key="transaccion.id"
        :concepto="transaccion.concepto"
        :fecha="transaccion.fecha"
        :categoria="transaccion.categoria"
        :monto="transaccion.monto"
        :tipo="transaccion.tipo"
      />
    </div>

    <Paginacion
      v-if="totalPaginas > 1"
      :paginaActual="paginaActual"
      :totalPaginas="totalPaginas"
      :totalItems="transacciones.length"
      :porPagina="porPagina"
      @cambiar="cambiarPagina"
    />
  </div>
</template>

<style scoped>
.lista-movimientos {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lista-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.lista-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.btn-ver-todos {
  background: none;
  border: none;
  color: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.movimientos-area {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.movimientos-area :deep(.movimiento:last-child) {
  border-bottom: none;
}
</style>
