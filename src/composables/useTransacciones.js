import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

function parseLocalDate(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str))
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(str)
}

function porcentajeCambio(actual, anterior) {
  if (anterior === 0) return null
  return (((actual - anterior) / anterior) * 100).toFixed(1)
}

export function useTransacciones() {
  const auth = useAuthStore()
  const transacciones = ref([])

  const obtenerTransacciones = async () => {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('fecha', { ascending: false })

    if (!error) {
      transacciones.value = data
    }
  }

  const eliminarTransaccion = async (id) => {
    const { error } = await supabase
      .from('transacciones')
      .delete()
      .eq('id', id)
    return !error
  }

  const saldoTotal = computed(() =>
    transacciones.value.reduce((acc, t) =>
      t.tipo === 'ingreso' ? acc + t.monto : acc - t.monto, 0)
  )

  const ingresosMes = computed(() => {
    const hoy = new Date()
    return transacciones.value
      .filter(t => {
        const fecha = parseLocalDate(t.fecha)
        return t.tipo === 'ingreso' &&
               fecha.getMonth() === hoy.getMonth() &&
               fecha.getFullYear() === hoy.getFullYear()
      })
      .reduce((acc, t) => acc + t.monto, 0)
  })

  const gastosMes = computed(() => {
    const hoy = new Date()
    return transacciones.value
      .filter(t => {
        const fecha = parseLocalDate(t.fecha)
        return t.tipo === 'gasto' &&
               fecha.getMonth() === hoy.getMonth() &&
               fecha.getFullYear() === hoy.getFullYear()
      })
      .reduce((acc, t) => acc + t.monto, 0)
  })

  const ingresosMesAnterior = computed(() => {
    const hoy = new Date()
    const mes = hoy.getMonth() === 0 ? 11 : hoy.getMonth() - 1
    const anio = hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear()
    return transacciones.value
      .filter(t => {
        const fecha = parseLocalDate(t.fecha)
        return t.tipo === 'ingreso' &&
               fecha.getMonth() === mes &&
               fecha.getFullYear() === anio
      })
      .reduce((acc, t) => acc + t.monto, 0)
  })

  const gastosMesAnterior = computed(() => {
    const hoy = new Date()
    const mes = hoy.getMonth() === 0 ? 11 : hoy.getMonth() - 1
    const anio = hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear()
    return transacciones.value
      .filter(t => {
        const fecha = parseLocalDate(t.fecha)
        return t.tipo === 'gasto' &&
               fecha.getMonth() === mes &&
               fecha.getFullYear() === anio
      })
      .reduce((acc, t) => acc + t.monto, 0)
  })

  const porcentajeCambioSaldo = computed(() => {
    const saldoAnterior = ingresosMesAnterior.value - gastosMesAnterior.value
    return porcentajeCambio(saldoTotal.value, saldoAnterior)
  })

  const porcentajeCambioIngresos = computed(() =>
    porcentajeCambio(ingresosMes.value, ingresosMesAnterior.value)
  )

  const porcentajeCambioGastos = computed(() =>
    porcentajeCambio(gastosMes.value, gastosMesAnterior.value)
  )

  return {
    transacciones,
    obtenerTransacciones,
    eliminarTransaccion,
    saldoTotal,
    ingresosMes,
    gastosMes,
    porcentajeCambioSaldo,
    porcentajeCambioIngresos,
    porcentajeCambioGastos,
  }
}
