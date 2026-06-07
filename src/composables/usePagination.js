import { ref, computed } from 'vue'

export function usePagination(items, porPaginaDefault = 10) {
  const paginaActual = ref(1)
  const porPagina = porPaginaDefault

  const totalPaginas = computed(() => Math.ceil(items.value.length / porPagina))

  const itemsPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * porPagina
    return items.value.slice(inicio, inicio + porPagina)
  })

  function cambiarPagina(n) {
    if (n >= 1 && n <= totalPaginas.value) paginaActual.value = n
  }

  return {
    paginaActual,
    porPagina,
    totalPaginas,
    itemsPaginados,
    cambiarPagina,
  }
}
