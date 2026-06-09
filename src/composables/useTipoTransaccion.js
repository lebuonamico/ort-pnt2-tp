const PALABRAS_INGRESO = ['ingreso', 'ingresos', 'income']

export function useTipoTransaccion() {
  const esIngreso = (tipo) => PALABRAS_INGRESO.includes(String(tipo).toLowerCase())

  return { esIngreso }
}
