export function useCurrency() {

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
    let date
    if (value instanceof Date) {
      date = value
    } else {
      // Date-only strings (YYYY-MM-DD) are parsed as UTC by spec, which shifts
      // the day backwards in negative-offset timezones (e.g. Argentina UTC-3).
      // Parsing the components manually creates a local-time Date instead.
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))
      date = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value)
    }
    if (Number.isNaN(date.getTime())) return ''
    return dateFormatter.format(date)
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate
  }
}
