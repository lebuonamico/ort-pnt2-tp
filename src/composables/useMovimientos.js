import { ref, computed } from 'vue'

export const categorias = ['Todas', 'Comida y Bebida', 'Transporte', 'Salud', 'Entretenimiento', 'Educación', 'Otros']

export const iconosPorCategoria = {
  'Comida y Bebida': '🍴',
  'Transporte': '🚗',
  'Salud': '❤️',
  'Entretenimiento': '🎬',
  'Educación': '📚',
  'Otros': '📦',
  'Ingresos': '💰',
}

export function useMovimientos(transacciones) {
  const busqueda = ref('')
  const filtroCategoria = ref('Todas')
  const filtroTipo = ref('Todos')
  const filtroFecha = ref('30')
  const paginaActual = ref(1)
  const porPagina = 10

  const transaccionesFiltradas = computed(() => {
    const hoy = new Date()
    return transacciones.value.filter(t => {
      const coincideBusqueda = t.concepto?.toLowerCase().includes(busqueda.value.toLowerCase())
      const coincideCategoria = filtroCategoria.value === 'Todas' || t.categoria === filtroCategoria.value
      const coincideTipo = filtroTipo.value === 'Todos' || t.tipo === filtroTipo.value
      const fecha = new Date(t.fecha)
      const diasAtras = new Date()
      diasAtras.setDate(hoy.getDate() - parseInt(filtroFecha.value))
      const coincideFecha = fecha >= diasAtras
      return coincideBusqueda && coincideCategoria && coincideTipo && coincideFecha
    })
  })

  const totalPaginas = computed(() => Math.ceil(transaccionesFiltradas.value.length / porPagina))

  const transaccionesPaginadas = computed(() => {
    const inicio = (paginaActual.value - 1) * porPagina
    return transaccionesFiltradas.value.slice(inicio, inicio + porPagina)
  })

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function formatearMonto(monto, tipo) {
    const signo = tipo === 'ingreso' ? '+' : '-'
    return `${signo}$${monto.toFixed(2)}`
  }

  function cambiarPagina(n) {
    if (n >= 1 && n <= totalPaginas.value) paginaActual.value = n
  }

  return {
    busqueda,
    filtroCategoria,
    filtroTipo,
    filtroFecha,
    paginaActual,
    porPagina,
    categorias,
    iconosPorCategoria,
    transaccionesFiltradas,
    totalPaginas,
    transaccionesPaginadas,
    formatearFecha,
    formatearMonto,
    cambiarPagina,
  }
}
