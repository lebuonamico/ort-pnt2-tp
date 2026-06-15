import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBorradorTransaccionStore = defineStore('borradorTransaccion', () => {
  const activo = ref(false)
  const tipo = ref('ingreso')
  const monto = ref(0)
  const concepto = ref('')
  const categoriaId = ref(null)
  const fecha = ref('')
  const notas = ref('')

  function guardar(datos) {
    tipo.value = datos.tipo
    monto.value = datos.monto
    concepto.value = datos.concepto
    categoriaId.value = datos.categoriaId
    fecha.value = datos.fecha
    notas.value = datos.notas
    activo.value = true
  }

  function limpiar() {
    activo.value = false
    tipo.value = 'ingreso'
    monto.value = 0
    concepto.value = ''
    categoriaId.value = null
    fecha.value = ''
    notas.value = ''
  }

  return { activo, tipo, monto, concepto, categoriaId, fecha, notas, guardar, limpiar }
}, {
  persist: {
    key: 'borrador-transaccion',
    storage: localStorage
  }
})
