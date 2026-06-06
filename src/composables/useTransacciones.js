import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

export function useTransacciones() {
  const auth = useAuthStore()
  const transacciones = ref([])
  const mesActual = new Date().getMonth()
const anioActual = new Date().getFullYear()

  const obtenerTransacciones = async () => {
    console.log('USER COMPLETO:', auth.user)        // ← agregá esta línea
    console.log('USER ID:', auth.user?.id)
    // agregar
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener transacciones:', error)
    } else {
        console.log('Transacciones:', data) 
        console.log('User:', auth.user)
        transacciones.value = data
    }
  }

  const saldoTotal = computed(() => {
  return transacciones.value.reduce((acc, t) => {
    return t.tipo === 'ingreso' ? acc + t.monto : acc - t.monto
  }, 0)
})

const ingresosMes = computed(() => {
  return transacciones.value
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'ingreso' && 
             fecha.getMonth() === mesActual && 
             fecha.getFullYear() === anioActual
    })
    .reduce((acc, t) => acc + t.monto, 0)
})

const gastosMes = computed(() => {
  return transacciones.value
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'gasto' && 
             fecha.getMonth() === mesActual && 
             fecha.getFullYear() === anioActual
    })
    .reduce((acc, t) => acc + t.monto, 0)
})



const ingresosMesAnterior = computed(() => {
  return transacciones.value
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'ingreso' && 
             fecha.getMonth() === mesActual - 1 && 
             fecha.getFullYear() === anioActual
    })
    .reduce((acc, t) => acc + t.monto, 0)
})

const gastosMesAnterior = computed(() => {
  return transacciones.value
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'gasto' && 
             fecha.getMonth() === mesActual - 1 && 
             fecha.getFullYear() === anioActual
    })
    .reduce((acc, t) => acc + t.monto, 0)
})

const porcentajeCambioSaldo = computed(() => {
  const saldoAnterior = ingresosMesAnterior.value - gastosMesAnterior.value
  if (saldoAnterior === 0) return 0
  return (((saldoTotal.value - saldoAnterior) / saldoAnterior) * 100).toFixed(1)
})

  return { transacciones, obtenerTransacciones, saldoTotal, ingresosMes, gastosMes, porcentajeCambioSaldo }
}