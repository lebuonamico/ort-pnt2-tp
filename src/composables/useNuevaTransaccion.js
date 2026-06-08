import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useCategories } from './useCategories'

export function useNuevaTransaccion() {
  const tipo = ref('ingreso')
  const monto = ref(0)
  const concepto = ref('')
  const categoria = ref(null)
  const fecha = ref(new Date().toISOString().split('T')[0])
  const notas = ref('')

  const auth = useAuthStore()
  const { categorias: todasLasCategorias, cargarCategorias } = useCategories()

  onMounted(() => cargarCategorias())

  const categoriasFiltradas = computed(() =>
    todasLasCategorias.value.filter(c => c.tipo === tipo.value)
  )

  watch(tipo, () => {
    categoria.value = null
  })

  const errores = computed(() => {
    const e = {}
    if (!monto.value || monto.value <= 0) e.monto = 'El monto debe ser mayor a 0'
    if (!concepto.value.trim()) e.concepto = 'El concepto es obligatorio'
    if (!categoria.value) e.categoria = 'Seleccioná una categoría'
    return e
  })

  const esValido = computed(() => Object.keys(errores.value).length === 0)

  function cargarTransaccion(t) {
    tipo.value = t.tipo
    monto.value = t.monto
    concepto.value = t.concepto
    fecha.value = t.fecha?.split('T')[0] ?? new Date().toISOString().split('T')[0]
    notas.value = t.notas ?? ''
    const cat = todasLasCategorias.value.find(c => c.nombre === t.categoria)
    categoria.value = cat ?? null
  }

  const guardar = async (id = null) => {
    if (!esValido.value) return false

    const datos = {
      tipo: tipo.value,
      monto: monto.value,
      concepto: concepto.value,
      categoria: categoria.value?.nombre ?? null,
      fecha: fecha.value,
      notas: notas.value
    }

    let error

    if (id) {
      const result = await supabase
        .from('transacciones')
        .update(datos)
        .eq('id', id)
      error = result.error
    } else {
      const result = await supabase
        .from('transacciones')
        .insert({ ...datos, user_id: auth.user.id })
      error = result.error
    }

    if (error) {
      console.error('Error al guardar:', error)
      return false
    }

    resetForm()
    return true
  }

  const resetForm = () => {
    tipo.value = 'ingreso'
    monto.value = 0
    concepto.value = ''
    categoria.value = null
    fecha.value = new Date().toISOString().split('T')[0]
    notas.value = ''
  }

  return {
    tipo,
    monto,
    concepto,
    categorias: categoriasFiltradas,
    categoria,
    fecha,
    notas,
    errores,
    esValido,
    guardar,
    cargarTransaccion
  }
}