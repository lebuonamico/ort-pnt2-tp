<script setup>
defineProps({
  paginaActual: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  porPagina: { type: Number, required: true },
})

defineEmits(['cambiar'])
</script>

<template>
  <div class="tabla-footer">
    <p class="total">
      Mostrando {{ (paginaActual - 1) * porPagina + 1 }} a
      {{ Math.min(paginaActual * porPagina, totalItems) }} de {{ totalItems }}
    </p>
    <div class="paginacion">
      <button @click="$emit('cambiar', paginaActual - 1)" :disabled="paginaActual === 1">‹</button>
      <button
        v-for="n in totalPaginas"
        :key="n"
        @click="$emit('cambiar', n)"
        :class="{ activa: n === paginaActual }"
      >{{ n }}</button>
      <button @click="$emit('cambiar', paginaActual + 1)" :disabled="paginaActual === totalPaginas">›</button>
    </div>
  </div>
</template>

<style scoped>
.tabla-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.total {
  font-size: 13px;
  color: #94a3b8;
}

.paginacion {
  display: flex;
  gap: 4px;
}

.paginacion button {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.paginacion button.activa {
  background: #006a61;
  color: white;
  border-color: #006a61;
}

.paginacion button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .tabla-footer {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .paginacion button {
    padding: 8px 14px;
  }
}
</style>
