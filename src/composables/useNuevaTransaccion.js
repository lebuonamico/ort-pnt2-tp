import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'



export function useNuevaTransaccion() {
  const tipo = ref('ingreso')
  const monto = ref(0)
  const concepto = ref('')
  const categorias = ['Comida y Bebida', 'Transporte', 'Salud', 'Entretenimiento', 'Educación', 'Otros']
  const categoria = ref('Comida y Bebida')
  const fecha = ref(new Date().toISOString().split('T')[0])
  const notas = ref('')

  const auth = useAuthStore()

  const guardar = async () => {
  const { error } = await supabase
    .from('transacciones')
    .insert({
      user_id: auth.user.id,
      tipo: tipo.value,
      monto: monto.value,
      concepto: concepto.value,
      categoria: categoria.value,
      fecha: fecha.value,
      notas: notas.value
    })

  if (error) {
    console.error('Error al guardar:', error)
  } else {
    console.log('Transacción guardada!')
    resetForm()
  }
}
const resetForm = () => {
  tipo.value = 'ingreso'
  monto.value = 0
  concepto.value = ''
  categoria.value = 'Comida y Bebida'
  fecha.value = new Date().toISOString().split('T')[0]
  notas.value = ''
}
return {
  tipo,
  monto,
  concepto,
  categorias,
  categoria,
  fecha,
  notas,
  guardar
}
}


