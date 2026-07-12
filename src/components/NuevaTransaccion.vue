<script setup>
import { ref, watch } from 'vue'
import { useNuevaTransaccion } from '../composables/useNuevaTransaccion'

const props = defineProps({
  show: { type: Boolean, required: true },
  transaccion: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const { tipo, monto, concepto, categorias, categoria, fecha, notas, errores, esValido, guardando, guardar, cargarTransaccion, guardarBorrador, cargarBorrador, hoyISO } = useNuevaTransaccion()

const submitted = ref(false)
const mensajeDuplicado = ref('')

watch(() => props.show, (val) => {
  if (val) {
    submitted.value = false
    mensajeDuplicado.value = ''
    if (!props.transaccion) cargarBorrador()
  }
})

watch(() => props.transaccion, (val) => {
  if (val) cargarTransaccion(val)
}, { immediate: true })

const cerrar = () => {
  if (!props.transaccion) guardarBorrador()
  emit('close')
}

const guardarYCerrar = async () => {
  submitted.value = true
  mensajeDuplicado.value = ''
  if (!esValido.value) return
  const { ok, duplicado } = await guardar(props.transaccion?.id ?? null)
  if (duplicado) {
    mensajeDuplicado.value = 'Esta transacción ya fue registrada. No se agregó un duplicado.'
    return
  }
  if (ok) emit('saved')
}
</script>

<template>
  <div v-if="show" class="overlay" @click.self="cerrar">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ transaccion ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </div>

      <div class="toggle">
        <button :class="{ activo: tipo === 'ingreso' }" @click="tipo = 'ingreso'">Ingreso</button>
        <button :class="{ activo: tipo === 'gasto' }" @click="tipo = 'gasto'">Gasto</button>
      </div>

      <div class="campo">
        <label for="monto">MONTO</label>
        <div class="monto-input" :class="{ 'input-error': submitted && errores.monto }">
          <span>$</span>
          <input id="monto" type="number" v-model="monto" min="0" step="0.01" />
        </div>
        <span v-if="submitted && errores.monto" class="error-msg">{{ errores.monto }}</span>
      </div>

      <div class="campo">
        <label for="concepto">CONCEPTO</label>
        <input id="concepto" type="text" v-model="concepto" placeholder="Ej. Compra de supermercado" :class="{ 'input-error': submitted && errores.concepto }" />
        <span v-if="submitted && errores.concepto" class="error-msg">{{ errores.concepto }}</span>
      </div>

      <div class="campo">
        <label for="categoria">CATEGORÍA</label>
        <select id="categoria" v-model="categoria" :class="{ 'input-error': submitted && errores.categoria }">
          <option :value="null" disabled>Seleccionar categoría</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat">{{ cat.nombre }}</option>
        </select>
        <span v-if="submitted && errores.categoria" class="error-msg">{{ errores.categoria }}</span>
      </div>

      <div class="campo">
        <label for="fecha">FECHA</label>
        <input id="fecha" type="date" v-model="fecha" :max="hoyISO()" :class="{ 'input-error': submitted && errores.fecha }" />
        <span v-if="submitted && errores.fecha" class="error-msg">{{ errores.fecha }}</span>
      </div>

      <div class="campo">
        <label for="notas">NOTAS (OPCIONAL)</label>
        <textarea id="notas" v-model="notas" placeholder="Detalles adicionales..."></textarea>
      </div>

      <span v-if="mensajeDuplicado" class="error-msg duplicado-msg">{{ mensajeDuplicado }}</span>

      <div class="modal-footer">
        <button class="btn-cancelar" @click="cerrar" :disabled="guardando">Cancelar</button>
        <button class="btn-guardar" @click="guardarYCerrar" :disabled="guardando">
          {{ guardando ? 'Guardando…' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}
.modal {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 480px) {
  .modal { padding: 20px; gap: 16px; }
  .modal-header h2 { font-size: 19px; }
}
.modal-header { display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { font-size: 22px; font-weight: 700; }
.btn-cerrar { background: none; border: none; font-size: 18px; cursor: pointer; }
.toggle { display: flex; background: var(--color-surface-2); border-radius: 10px; padding: 4px; }
.toggle button { flex: 1; padding: 10px; border: none; border-radius: 8px; background: transparent; cursor: pointer; font-weight: 600; color: var(--color-text-muted); }
.toggle button.activo { background: var(--color-surface); color: var(--color-accent); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.campo { display: flex; flex-direction: column; gap: 4px; }
.campo label { font-size: 12px; font-weight: 600; color: var(--color-text-muted); letter-spacing: 0.05em; }
.campo input, .campo select, .campo textarea { padding: 12px 16px; border: 1px solid var(--color-border); border-radius: 10px; font-size: 16px; font-family: inherit; outline: none; background: var(--color-surface-2); color: var(--color-text-primary); }
.campo textarea { resize: none; height: 80px; }
.monto-input { display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: 10px; padding: 12px 16px; gap: 8px; }
.monto-input span { color: var(--color-text-muted); font-size: 18px; }
.monto-input input { border: none; outline: none; font-size: 28px; font-weight: 700; text-align: right; width: 100%; padding: 0; background: transparent; color: var(--color-text-primary); }
.input-error { border-color: var(--color-danger) !important; }
.error-msg { font-size: 12px; color: var(--color-danger); }
.duplicado-msg { text-align: center; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; }
.btn-cancelar { padding: 12px 24px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-text-primary); cursor: pointer; font-weight: 600; }
.btn-guardar { padding: 12px 24px; border: none; border-radius: 10px; background: var(--color-accent); color: var(--color-on-accent); cursor: pointer; font-weight: 600; }
.btn-guardar:disabled, .btn-cancelar:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
