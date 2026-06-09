import { ref, computed } from 'vue'
import { useFechas } from './useFechas'

export function useEstadisticas(transacciones) {
  const { mesCorto } = useFechas()
  const periodoActivo = ref('mes')

  const transaccionesFiltradas = computed(() => {
    const hoy = new Date()
    const desde = new Date(hoy)
    if (periodoActivo.value === 'mes') {
      desde.setDate(1); desde.setHours(0,0,0,0)
    } else if (periodoActivo.value === 'trimestre') {
      desde.setMonth(hoy.getMonth() - 2); desde.setDate(1); desde.setHours(0,0,0,0)
    } else {
      desde.setMonth(0); desde.setDate(1); desde.setHours(0,0,0,0)
    }
    return transacciones.value.filter(t => {
      const fecha = new Date(t.fecha)
      return fecha >= desde && fecha <= hoy
    })
  })

  const totalIngresos = computed(() =>
    transaccionesFiltradas.value.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + Number(t.monto), 0)
  )

  const totalGastos = computed(() =>
    transaccionesFiltradas.value.filter(t => t.tipo === 'gasto').reduce((s, t) => s + Number(t.monto), 0)
  )

  const porcentajeAhorro = computed(() => {
    if (totalIngresos.value === 0) return 0
    return ((totalIngresos.value - totalGastos.value) / totalIngresos.value) * 100
  })

  const agruparGastosPorCategoria = () => {
    const agrupado = {}
    transaccionesFiltradas.value.filter(t => t.tipo === 'gasto').forEach(t => {
      const cat = t.categoria || 'Otros'
      agrupado[cat] = (agrupado[cat] || 0) + Number(t.monto)
    })
    return Object.entries(agrupado).sort(([,a],[,b]) => b - a)
  }

  const categoriasPrincipal = computed(() => {
    const top = agruparGastosPorCategoria()[0]
    return top ? { nombre: top[0], monto: top[1] } : { nombre: '—', monto: 0 }
  })

  const labelsFlujo = computed(() => {
    const labels = []
    const hoy = new Date()
    for (let i = 5; i >= 0; i--) {
      labels.push(mesCorto(new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)))
    }
    return labels
  })

  const datosFlujo = computed(() => {
    const hoy = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
      return transacciones.value
        .filter(t => {
          const f = new Date(t.fecha)
          return t.tipo === 'gasto' && f.getMonth() === mes.getMonth() && f.getFullYear() === mes.getFullYear()
        })
        .reduce((s, t) => s + Number(t.monto), 0)
    })
  })

  const datosIngresos = computed(() => {
    const hoy = new Date()
    return Array.from({ length: 6 }, (_, i) => {
     const mes = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
      return transacciones.value
        .filter(t => {
          const f = new Date(t.fecha)
          return t.tipo === 'ingreso' && f.getMonth() === mes.getMonth() && f.getFullYear() === mes.getFullYear()
       })
       .reduce((s, t) => s + Number(t.monto), 0)
   })
  })
  
  const _gastosPorCategoria = computed(() => {
    const agrupado = {}
    transaccionesFiltradas.value.filter(t => t.tipo === 'gasto').forEach(t => {
      const cat = t.categoria || 'Otros'
      agrupado[cat] = (agrupado[cat] || 0) + Number(t.monto)
    })
    return Object.entries(agrupado).sort(([,a],[,b]) => b - a)
  })

  const categoriasDoughnut = computed(() => _gastosPorCategoria.value.map(([k]) => k))
  const montosDoughnut     = computed(() => _gastosPorCategoria.value.map(([,v]) => v))

  function cambiarPeriodo(nuevo) { periodoActivo.value = nuevo }

  return {
    periodoActivo, cambiarPeriodo,
    totalIngresos, totalGastos, porcentajeAhorro,
    categoriasPrincipal, labelsFlujo, datosFlujo,
    categoriasDoughnut, montosDoughnut,
    datosIngresos,
  }
}
