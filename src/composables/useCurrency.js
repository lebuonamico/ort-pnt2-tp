import { useFechas } from './useFechas'

export function useCurrency() {
  const { parseLocalDate } = useFechas()

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  })

  const numberFormatter = new Intl.NumberFormat('es-AR')

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0
    return currencyFormatter.format(numeric)
  }

  const formatNumber = (value) => {
    const numeric = Number(value) || 0
    return numberFormatter.format(numeric)
  }

  const formatDate = (value) => {
    if (!value) return ''
    const date = value instanceof Date ? value : parseLocalDate(value)
    if (Number.isNaN(date.getTime())) return ''
    return dateFormatter.format(date)
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate
  }
}
