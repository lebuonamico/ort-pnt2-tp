<!-- src/components/ResumenBarras.vue -->
<template>
  <div class="resumen-barras">

    <div class="barra-item">
      <div class="barra-header">
        <span class="barra-label">Ingresos</span>
        <span class="barra-monto" style="color: #0F6E56;">{{ formatear(totalIngresos) }}</span>
      </div>
      <div class="barra-track">
        <div class="barra-fill" :style="{ width: pctIngresos + '%', background: '#1D9E75' }"></div>
      </div>
    </div>

    <div class="barra-item">
      <div class="barra-header">
        <span class="barra-label">Gastos</span>
        <span class="barra-monto" style="color: #993C1D;">{{ formatear(totalGastos) }}</span>
      </div>
      <div class="barra-track">
        <div class="barra-fill" :style="{ width: pctGastos + '%', background: '#D85A30' }"></div>
      </div>
    </div>

    <div class="barra-item">
      <div class="barra-header">
        <span class="barra-label">Saldo</span>
        <span class="barra-monto" style="color: #185FA5;">{{ formatear(saldo) }}</span>
      </div>
      <div class="barra-track">
        <div class="barra-fill" :style="{ width: pctSaldo + '%', background: '#378ADD' }"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalIngresos: { type: Number, default: 0 },
  totalGastos:   { type: Number, default: 0 }
})

const saldo      = computed(() => props.totalIngresos - props.totalGastos)
const maximo     = computed(() => Math.max(props.totalIngresos, props.totalGastos, saldo.value, 1))
const pctIngresos = computed(() => (props.totalIngresos / maximo.value) * 100)
const pctGastos   = computed(() => (props.totalGastos   / maximo.value) * 100)
const pctSaldo    = computed(() => (Math.max(saldo.value, 0) / maximo.value) * 100)

function formatear(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}
</script>

<style scoped>
.resumen-barras {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.barra-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.barra-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.barra-label {
  font-size: 13px;
  color: #6b6b6b;
}
.barra-monto {
  font-size: 14px;
  font-weight: 500;
}
.barra-track {
  height: 8px;
  background: #f0f0ee;
  border-radius: 4px;
  overflow: hidden;
}
.barra-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}
</style>