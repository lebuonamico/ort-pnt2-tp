```vue
<script setup>
import { computed } from 'vue'
import { iconosPorCategoria } from '../composables/useMovimientos'

const props = defineProps({
  transaccion: { type: Object, required: true },
  formatearFecha: { type: Function, required: true },
  formatearMonto: { type: Function, required: true },
})

const icono = computed(() => iconosPorCategoria[props.transaccion.categoria] ?? '📦')
</script>

<template>
  <tr>
    <td>{{ formatearFecha(transaccion.fecha) }}</td>
    <td class="td-concepto">
      <span class="icono-cat">{{ icono }}</span>
      {{ transaccion.concepto }}
    </td>
    <td>
      <span class="badge" :class="transaccion.tipo">{{ transaccion.categoria }}</span>
    </td>
    <td :class="transaccion.tipo === 'ingreso' ? 'positivo' : 'negativo'">
      {{ formatearMonto(transaccion.monto, transaccion.tipo) }}
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #0f172a;
}

.td-concepto {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-cat {
  font-size: 20px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.ingreso {
  background: #dcfce7;
  color: #16a34a;
}

.badge.gasto {
  background: #fef3c7;
  color: #d97706;
}

.positivo {
  color: #006a61;
  font-weight: 700;
}

.negativo {
  color: #ef4444;
  font-weight: 700;
}

@media (max-width: 768px) {
  td:nth-child(1) {
    display: none;
  }

  td {
    padding: 10px 6px;
    font-size: 12px;
  }
}
</style>

```