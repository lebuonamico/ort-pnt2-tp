const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function useFechas() {
  const parseLocalDate = (str) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str))
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(str)
  }

  const mesCorto = (date) => MESES_CORTOS[date.getMonth()]

  const fechaLarga = (date = new Date()) =>
    date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

  return { parseLocalDate, mesCorto, fechaLarga, MESES_CORTOS }
}
