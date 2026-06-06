<script setup>
import { computed } from 'vue'

const iconosPorCategoria = {
  'Comida y Bebida': '🍴',
  'Transporte': '🚗',
  'Salud': '❤️',
  'Entretenimiento': '🎬',
  'Educación': '📚',
  'Otros': '📦'
}

const props = defineProps({
  concepto: {
    type: String,
    required: true
  },
  fecha: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    required: true
  }
})

const icono = computed(() => iconosPorCategoria[props.categoria] ?? '📦')

console.log('monto:', props.monto)

</script>

<template>
  <div class="movimiento">

    <!-- Icono -->
    <span class="icono">{{ icono }}</span>

    <!-- Info -->
    <div class="info">
      <p class="concepto">{{ concepto }}</p>
      <p class="detalle">{{ fecha }} • {{ categoria }}</p>
    </div>

    <!-- Monto -->
    <p class="monto" :class="tipo === 'ingreso' ? 'positivo' : 'negativo'">
      {{ tipo === 'ingreso' ? '+' : '-' }}${{ monto }}
    </p>

  </div>
  
</template>

<style scoped>
.movimiento {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;
  overflow: hidden;
}

.icono {
  font-size: 24px;
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
