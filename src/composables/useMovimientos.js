import { ref, computed } from 'vue'
import { useCurrency } from './useCurrency'
import { usePagination } from './usePagination'

function parseLocalDate(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str))
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(str)
}

export function useMovimientos(transacciones) {
  const { formatDate, formatCurrency } = useCurrency()

  const busqueda = ref('')
  const filtroCategoria = ref('Todas')
  const filtroTipo = ref('Todos')
  const filtroFecha = ref('9999')

  const transaccionesFiltradas = computed(() => {
    const hoy = new Date()
    return transacciones.value.filter(t => {
      const coincideBusqueda = t.concepto?.toLowerCase().includes(busqueda.value.toLowerCase())
      const coincideCategoria = filtroCategoria.value === 'Todas' || t.categoria === filtroCategoria.value
      const coincideTipo = filtroTipo.value === 'Todos' || t.tipo === filtroTipo.value
      const fecha = parseLocalDate(t.fecha)
      const diasAtras = new Date()
      diasAtras.setDate(hoy.getDate() - Number.parseInt(filtroFecha.value))
      const coincideFecha = fecha >= diasAtras
      return coincideBusqueda && coincideCategoria && coincideTipo && coincideFecha
    })
  })

  const {
    paginaActual,
    porPagina,
    totalPaginas,
    itemsPaginados: transaccionesPaginadas,
    cambiarPagina,
  } = usePagination(transaccionesFiltradas, 7)

  function formatearMonto(monto, tipo) {
    const signo = tipo === 'ingreso' ? '+' : '-'
    return `${signo}${formatCurrency(monto)}`
  }

  return {
    busqueda,
    filtroCategoria,
    filtroTipo,
    filtroFecha,
    paginaActual,
    porPagina,
    transaccionesFiltradas,
    totalPaginas,
    transaccionesPaginadas,
    formatearFecha: formatDate,
    formatearMonto,
    cambiarPagina,
  }
}
