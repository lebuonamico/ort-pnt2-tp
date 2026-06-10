import { ref } from 'vue'

const colapsado = ref(localStorage.getItem('sidebar-colapsado') === 'true')

function toggleSidebar() {
  colapsado.value = !colapsado.value
  localStorage.setItem('sidebar-colapsado', String(colapsado.value))
}

function cerrarSidebar() {
  colapsado.value = true
  localStorage.setItem('sidebar-colapsado', 'true')
}

export function useSidebar() {
  return { colapsado, toggleSidebar, cerrarSidebar }
}
