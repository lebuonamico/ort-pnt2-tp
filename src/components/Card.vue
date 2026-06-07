<script setup>
import { useCurrency } from '../composables/useCurrency'

const { formatCurrency } = useCurrency()

defineProps({
  titulo: { type: String, required: true },
  monto: { type: Number, required: true },
  imagen: { type: String, required: true },
  variacion: { type: [String, Number], default: null },
  invertirVariacion: { type: Boolean, default: false },
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="titulo">{{ titulo }}</span>
      <div class="icono-wrapper">
        <img :src="imagen" alt="" class="icono-img" />
      </div>
    </div>

    <p class="monto">{{ formatCurrency(monto) }}</p>

    <span v-if="variacion !== null" class="badge-variacion" :class="(Number(variacion) >= 0) !== invertirVariacion ? 'positivo' : 'negativo'">
      {{ Number(variacion) >= 0 ? '+' : '' }}{{ variacion }}% vs mes anterior
    </span>
    <span v-else class="sin-datos">Sin datos del mes anterior</span>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.icono-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.icono-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.monto {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.badge-variacion {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  align-self: flex-start;
}

.badge-variacion.positivo {
  background: #d1fae5;
  color: #006a61;
}

.badge-variacion.negativo {
  background: #fee2e2;
  color: #ef4444;
}

.sin-datos {
  font-size: 12px;
  color: #94a3b8;
}
</style>
