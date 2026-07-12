import { computed } from 'vue'
import { useTheme } from './useTheme'

export function useChartColors() {
  const { tema } = useTheme()
  const esOscuro = computed(() => tema.value === 'dark')

  return {
    esOscuro,
    tick: computed(() => (esOscuro.value ? '#8b969d' : '#64748b')),
    grid: computed(() => (esOscuro.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)')),
    legend: computed(() => (esOscuro.value ? '#e6eaed' : '#0b1c30')),
    tooltipBg: computed(() => (esOscuro.value ? '#1e262b' : '#0f172a')),
    surface: computed(() => (esOscuro.value ? '#171d21' : '#ffffff')),
  }
}
