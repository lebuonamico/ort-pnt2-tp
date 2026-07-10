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
  <div class="app-card app-card-interactive card-inner">
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
.card-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-body);
}

.icono-wrapper {
  width: 44px;
  height: 44px;
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
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-heading);
  letter-spacing: -0.01em;
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
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge-variacion.negativo {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.sin-datos {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
