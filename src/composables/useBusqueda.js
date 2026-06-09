import { computed, ref } from 'vue'

export function useBusqueda(items, campos) {
  const termino = ref('')

  const resultados = computed(() => {
    const t = termino.value.trim().toLowerCase()
    if (!t) return items.value
    return items.value.filter((item) =>
      campos.some((campo) => (item[campo] || '').toLowerCase().includes(t))
    )
  })

  return { termino, resultados }
}
