<script setup>
import { computed } from 'vue'
import { useCategories } from '../composables/useCategories'
import { useCurrency } from '../composables/useCurrency'

const { imagenDeCategoria } = useCategories()
const { formatDate, formatCurrency } = useCurrency()

const props = defineProps({
  transaccion: { type: Object, required: true },
})

const imagenUrl = computed(() => imagenDeCategoria(props.transaccion.categoria))

function formatearMonto(monto, tipo) {
  const signo = tipo === 'ingreso' ? '+' : '-'
  return `${signo}${formatCurrency(monto)}`
}
</script>

<template>
  <tr>
    <td>{{ formatDate(transaccion.fecha) }}</td>
    <td class="td-concepto">
      <div class="icono-cat">
        <img v-if="imagenUrl" :src="imagenUrl" :alt="transaccion.categoria" class="categoria-img" />
        <span v-else class="material-symbols-outlined icono-fallback">category</span>
      </div>
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
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.categoria-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icono-fallback {
  font-size: 18px;
  color: #94a3b8;
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
