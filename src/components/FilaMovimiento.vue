<script setup>
import { computed } from 'vue'
import { useCategories } from '../composables/useCategories'
import { useCurrency } from '../composables/useCurrency'

const { imagenDeCategoria } = useCategories()
const { formatDate, formatCurrency } = useCurrency()

const props = defineProps({
  transaccion: { type: Object, required: true },
})

defineEmits(['editar', 'eliminar'])

const imagenUrl = computed(() => imagenDeCategoria(props.transaccion.categoria))

function formatearMonto(monto, tipo) {
  const signo = tipo === 'ingreso' ? '+' : '-'
  return `${signo}${formatCurrency(monto)}`
}
</script>

<template>
  <tr>
    <td>{{ formatDate(transaccion.fecha) }}</td>
    <td>
      <div class="concepto-inner">
        <div class="icono-cat">
          <img v-if="imagenUrl" :src="imagenUrl" :alt="transaccion.categoria" class="categoria-img" />
          <span v-else class="material-symbols-outlined icono-fallback">category</span>
        </div>
        {{ transaccion.concepto }}
      </div>
    </td>
    <td>
      <span class="badge" :class="transaccion.tipo">{{ transaccion.categoria }}</span>
    </td>
    <td :class="transaccion.tipo === 'ingreso' ? 'positivo' : 'negativo'">
      {{ formatearMonto(transaccion.monto, transaccion.tipo) }}
    </td>
    <td class="td-acciones">
      <div class="acciones-inner">
        <button class="btn-editar" @click="$emit('editar', transaccion)" title="Editar">✏️</button>
        <button class="btn-eliminar" @click="$emit('eliminar', transaccion)" title="Eliminar">🗑️</button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
  color: var(--color-text-primary);
  vertical-align: middle;
}

.concepto-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-cat {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-surface-2);
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
  color: var(--color-text-muted);
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.ingreso {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge.gasto {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.positivo { color: var(--color-accent); font-weight: 700; }
.negativo { color: var(--color-danger); font-weight: 700; }

.acciones-inner {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-editar, .btn-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-editar:hover { background: var(--color-accent-soft); }
.btn-eliminar:hover { background: var(--color-danger-bg); }

@media (max-width: 768px) {
  td:nth-child(1) { display: none; }
  td { padding: 10px 6px; font-size: 12px; }
}
</style>
