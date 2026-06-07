<script setup>
import { computed } from 'vue'

const props = defineProps({
  paginaActual: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  porPagina: { type: Number, required: true },
})

const emit = defineEmits(['cambiar'])

const VENTANA = 5

const paginasVisibles = computed(() => {
  const inicio = Math.floor((props.paginaActual - 1) / VENTANA) * VENTANA + 1
  const fin = Math.min(inicio + VENTANA - 1, props.totalPaginas)
  const paginas = []
  for (let i = inicio; i <= fin; i++) paginas.push(i)
  return paginas
})

const hayGrupoAnterior = computed(() => paginasVisibles.value[0] > 1)
const hayGrupoSiguiente = computed(() => paginasVisibles.value[paginasVisibles.value.length - 1] < props.totalPaginas)

function irGrupoAnterior() {
  emit('cambiar', paginasVisibles.value[0] - 1)
}

function irGrupoSiguiente() {
  emit('cambiar', paginasVisibles.value[paginasVisibles.value.length - 1] + 1)
}
</script>

<template>
  <div class="paginacion-wrapper">
    <span class="total">{{ (paginaActual - 1) * porPagina + 1 }}–{{ Math.min(paginaActual * porPagina, totalItems) }} de {{ totalItems }}</span>

    <div class="paginacion">
      <button class="btn-nav" @click="$emit('cambiar', paginaActual - 1)" :disabled="paginaActual === 1">‹</button>

      <span v-if="hayGrupoAnterior" class="dots" @click="irGrupoAnterior">…</span>

      <button
        v-for="n in paginasVisibles"
        :key="n"
        class="btn-pag"
        :class="{ activa: n === paginaActual }"
        @click="$emit('cambiar', n)"
      >{{ n }}</button>

      <span v-if="hayGrupoSiguiente" class="dots" @click="irGrupoSiguiente">…</span>

      <button class="btn-nav" @click="$emit('cambiar', paginaActual + 1)" :disabled="paginaActual === totalPaginas">›</button>
    </div>
  </div>
</template>

<style scoped>
.paginacion-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.total {
  font-size: 12px;
  color: #94a3b8;
}

.paginacion {
  display: flex;
  align-items: center;
  gap: 2px;
}

.btn-nav, .btn-pag {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #475569;
  transition: background 0.15s;
}

.btn-nav:hover:not(:disabled),
.btn-pag:hover:not(.activa) {
  background: #f1f5f9;
}

.btn-pag.activa {
  background: #006a61;
  color: white;
  font-weight: 600;
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.dots {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.dots:hover {
  background: #f1f5f9;
}
</style>
