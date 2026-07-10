import { ref } from 'vue'

const KEY = 'app-theme'

const tema = ref(localStorage.getItem(KEY) || 'dark')

function aplicar(t) {
  document.documentElement.setAttribute('data-theme', t)
}

aplicar(tema.value)

function toggleTema() {
  tema.value = tema.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem(KEY, tema.value)
  aplicar(tema.value)
}

export function useTheme() {
  return { tema, toggleTema }
}
