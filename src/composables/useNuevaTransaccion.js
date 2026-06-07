import { ref, computed, watch } from 'vue'
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

  cargarCategorias()

  const categoriasFiltradas = computed(() =>
    todasLasCategorias.value.filter(c => c.tipo === tipo.value)
  )

  // Al cambiar el tipo, resetear la categoría seleccionada
  watch(tipo, () => {
    categoria.value = null
  })

  const guardar = async () => {
    const { error } = await supabase
      .from('transacciones')
      .insert({
        user_id: auth.user.id,
        tipo: tipo.value,
        monto: monto.value,
        concepto: concepto.value,
        categoria: categoria.value?.nombre ?? null,
        fecha: fecha.value,
        notas: notas.value
      })

    if (error) {
      console.error('Error al guardar:', error)
    } else {
      resetForm()
    }
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
    guardar
  }
}


