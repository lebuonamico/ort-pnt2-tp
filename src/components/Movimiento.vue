<script setup>
import { computed } from 'vue'
import { useCategories } from '../composables/useCategories'
import { useCurrency } from '../composables/useCurrency'

const { imagenDeCategoria } = useCategories()
const { formatDate, formatCurrency } = useCurrency()

const props = defineProps({
  concepto: { type: String, required: true },
  fecha: { type: String, required: true },
  categoria: { type: String, required: true },
  monto: { type: Number, required: true },
  tipo: { type: String, required: true },
})

const imagenUrl = computed(() => imagenDeCategoria(props.categoria))
const fechaFormateada = computed(() => formatDate(props.fecha))
</script>

<template>
  <div class="movimiento">

    <div class="icono">
      <img v-if="imagenUrl" :src="imagenUrl" :alt="categoria" class="categoria-img" />
      <span v-else class="material-symbols-outlined icono-fallback">category</span>
    </div>

    <div class="info">
      <p class="concepto">{{ concepto }}</p>
      <p class="detalle">{{ fechaFormateada }} • {{ categoria }}</p>
    </div>

    <p class="monto" :class="tipo === 'ingreso' ? 'positivo' : 'negativo'">
      {{ tipo === 'ingreso' ? '+' : '-' }}{{ formatCurrency(monto) }}
    </p>

  </div>
</template>

<style scoped>
.movimiento {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;
  overflow: hidden;
}


.icono {
  width: 36px;
  height: 36px;
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
  font-size: 20px;
  color: #94a3b8;
}

.info {
  flex: 1;
}

.concepto {
  font-weight: 600;
  color: #0f172a;
}

.detalle {
  font-size: 12px;
  color: #94a3b8;
}

.monto {
  font-weight: 700;
  margin-left: auto;
  flex-shrink: 0;
  white-space: nowrap;
}

.positivo {
  color: #006a61;
}

.negativo {
  color: #ef4444;
}
</style>
