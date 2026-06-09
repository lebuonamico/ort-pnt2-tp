import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useFechas } from './useFechas'

function porcentajeCambio(actual, anterior) {
  if (anterior === 0) return null
  return (((actual - anterior) / anterior) * 100).toFixed(1)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const MAX_INTENTOS = 3

export function useTransacciones() {
  const auth = useAuthStore()
  const { parseLocalDate } = useFechas()
  const transacciones = ref([])
  const cargando = ref(false)
  const errorCarga = ref(null)

  const obtenerTransacciones = async () => {
    if (!auth.user?.id) {
      errorCarga.value = 'No hay una sesión activa.'
      return
    }

    cargando.value = true
    errorCarga.value = null

    try {
      for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        const { data, error } = await supabase
          .from('transacciones')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('fecha', { ascending: false })

        if (!error) {
          transacciones.value = data ?? []
          errorCarga.value = null
          return
        }

        if (intento < MAX_INTENTOS) {
          await delay(400 * intento)
        } else {
          console.error('No se pudieron cargar las transacciones:', error.message)
          errorCarga.value = 'No se pudieron cargar los datos.'
        }
      }
    } catch (err) {
      console.error('Error inesperado al cargar transacciones:', err)
      errorCarga.value = 'No se pudieron cargar los datos.'
    } finally {
      cargando.value = false
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

  const totalPorMes = (tipo, mes, anio) =>
    transacciones.value
      .filter(t => {
        const fecha = parseLocalDate(t.fecha)
        return t.tipo === tipo && fecha.getMonth() === mes && fecha.getFullYear() === anio
      })
      .reduce((acc, t) => acc + t.monto, 0)

  const mesActual = computed(() => {
    const hoy = new Date()
    return { mes: hoy.getMonth(), anio: hoy.getFullYear() }
  })

  const mesPrevio = computed(() => {
    const hoy = new Date()
    return {
      mes: hoy.getMonth() === 0 ? 11 : hoy.getMonth() - 1,
      anio: hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear(),
    }
  })

  const ingresosMes = computed(() => totalPorMes('ingreso', mesActual.value.mes, mesActual.value.anio))
  const gastosMes = computed(() => totalPorMes('gasto', mesActual.value.mes, mesActual.value.anio))
  const ingresosMesAnterior = computed(() => totalPorMes('ingreso', mesPrevio.value.mes, mesPrevio.value.anio))
  const gastosMesAnterior = computed(() => totalPorMes('gasto', mesPrevio.value.mes, mesPrevio.value.anio))

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
    cargando,
    errorCarga,
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
