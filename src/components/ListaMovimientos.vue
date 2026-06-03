<script setup>

import Movimiento from './Movimiento.vue'

defineProps({
  transacciones: {
    type: Array,
    required: true
  }
})


</script>

<template>
  <div class="lista-movimientos">
    <div class="lista-header">
      <h3>Movimientos</h3>
      <button class="btn-ver-todos">Ver todos</button>
    </div>

    <Movimiento
      v-for="transaccion in transacciones"
      :key="transaccion.id"
      :concepto="transaccion.concepto"
      :fecha="transaccion.fecha"
      :categoria="transaccion.categoria"
      :monto="transaccion.monto"
      :tipo="transaccion.tipo"
    />
  </div>
</template>

<style scoped>
.lista-movimientos {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 24px;
}
.lista-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.lista-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.btn-ver-todos {
  background: none;
  border: none;
  color: #006a61;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
</style>