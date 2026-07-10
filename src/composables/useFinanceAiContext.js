import { computed, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const MAX_TRANSACCIONES_CONTEXTO = 80

function moneda(valor) {
  return Number(valor || 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  })
}

function agruparPorCategoria(transacciones, tipo) {
  const agrupado = transacciones
    .filter((t) => t.tipo === tipo)
    .reduce((acc, t) => {
      const categoria = t.categoria || 'Sin categoria'
      acc[categoria] = (acc[categoria] || 0) + Number(t.monto || 0)
      return acc
    }, {})

  return Object.entries(agrupado)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([categoria, total]) => ({ categoria, total }))
}

function calcularResumen(transacciones) {
  const ingresos = transacciones
    .filter((t) => t.tipo === 'ingreso')
    .reduce((acc, t) => acc + Number(t.monto || 0), 0)
  const gastos = transacciones
    .filter((t) => t.tipo === 'gasto')
    .reduce((acc, t) => acc + Number(t.monto || 0), 0)

  return {
    ingresos,
    gastos,
    saldo: ingresos - gastos,
    ahorroPorcentaje: ingresos > 0 ? ((ingresos - gastos) / ingresos) * 100 : 0,
  }
}

function serializarTransaccion(t) {
  return {
    fecha: t.fecha,
    concepto: t.concepto,
    categoria: t.categoria || 'Sin categoria',
    tipo: t.tipo,
    monto: Number(t.monto || 0),
  }
}

export function crearRespuestaDemo(pregunta, contexto) {
  const texto = pregunta.toLowerCase()
  const resumen = contexto.resumen
  const gastosTop = contexto.gastosPorCategoria[0]

  if (texto.includes('ahorro')) {
    return `Modo demo: tu ahorro estimado es de ${resumen.ahorroPorcentaje}%. Ingresos: ${resumen.ingresos}, gastos: ${resumen.gastos} y saldo: ${resumen.saldo}.`
  }

  if (texto.includes('categoria') || texto.includes('gasto')) {
    if (!gastosTop) return 'Modo demo: todavia no tengo gastos cargados para detectar una categoria principal.'
    return `Modo demo: la categoria con mas gasto es ${gastosTop.categoria}, con ${moneda(gastosTop.total)}. Te conviene revisar si ese gasto se repite todos los meses.`
  }

  if (texto.includes('consejo') || texto.includes('mejorar')) {
    return `Modo demo: 1) revisa la categoria que mas pesa, 2) separa un objetivo de ahorro mensual, 3) carga cada movimiento para que las estadisticas sean mas precisas. Tu saldo actual estimado es ${resumen.saldo}.`
  }

  return `Modo demo: puedo ayudarte con tu resumen financiero. Veo ${resumen.transaccionesAnalizadas} movimientos analizados, saldo ${resumen.saldo}, ingresos ${resumen.ingresos} y gastos ${resumen.gastos}.`
}

export function useFinanceAiContext() {
  const auth = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  const puedeCargarContexto = computed(() => Boolean(auth.user?.id))

  async function crearContextoFinanciero() {
    if (!puedeCargarContexto.value) {
      return {
        app: {
          nombre: 'Finanzas Pro',
          descripcion: 'Aplicacion de finanzas personales.',
          moneda: 'ARS',
        },
        resumen: {
          ingresos: moneda(0),
          gastos: moneda(0),
          saldo: moneda(0),
          ahorroPorcentaje: 0,
          transaccionesAnalizadas: 0,
        },
        gastosPorCategoria: [],
        ingresosPorCategoria: [],
        movimientosRecientes: [],
      }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('transacciones')
        .select('fecha, concepto, categoria, tipo, monto')
        .eq('user_id', auth.user.id)
        .order('fecha', { ascending: false })
        .limit(MAX_TRANSACCIONES_CONTEXTO)

      if (supabaseError) throw supabaseError

      const transacciones = data ?? []
      const resumen = calcularResumen(transacciones)
      const gastosPorCategoria = agruparPorCategoria(transacciones, 'gasto')
      const ingresosPorCategoria = agruparPorCategoria(transacciones, 'ingreso')

      return {
        app: {
          nombre: 'Finanzas Pro',
          descripcion: 'Aplicacion para registrar ingresos y gastos, consultar movimientos y analizar estadisticas.',
          moneda: 'ARS',
        },
        resumen: {
          ingresos: moneda(resumen.ingresos),
          gastos: moneda(resumen.gastos),
          saldo: moneda(resumen.saldo),
          ahorroPorcentaje: Number(resumen.ahorroPorcentaje.toFixed(1)),
          transaccionesAnalizadas: transacciones.length,
        },
        gastosPorCategoria,
        ingresosPorCategoria,
        movimientosRecientes: transacciones.slice(0, 12).map(serializarTransaccion),
      }
    } catch (err) {
      console.error('No se pudo crear el contexto financiero:', err)
      error.value = 'No se pudo cargar el contexto financiero.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    crearContextoFinanciero,
  }
}
