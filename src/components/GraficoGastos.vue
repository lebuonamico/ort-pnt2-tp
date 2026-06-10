<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useFechas } from '../composables/useFechas'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const { parseLocalDate } = useFechas()

const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  }
})

const periodoSeleccionado = ref('semanal')

const labelsSemanal = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const labelsMensual = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
const labelsAnual = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const gastosSemanal = computed(() => {
  const totales = [0, 0, 0, 0, 0, 0, 0]
  const hoy = new Date()
  const diaSemana = hoy.getDay()
  const inicioSemana = new Date(hoy)
  inicioSemana.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1))
  inicioSemana.setHours(0, 0, 0, 0)
  const finSemana = new Date(inicioSemana)
  finSemana.setDate(inicioSemana.getDate() + 6)
  finSemana.setHours(23, 59, 59, 999)

  props.transacciones
    .filter(t => {
      const fecha = parseLocalDate(t.fecha)
      return t.tipo === 'gasto' && fecha >= inicioSemana && fecha <= finSemana
    })
    .forEach(t => {
      const dia = parseLocalDate(t.fecha).getDay()
      const indice = dia === 0 ? 6 : dia - 1
      totales[indice] += t.monto
    })
  return totales
})

const gastosMensual = computed(() => {
  const totales = [0, 0, 0, 0]
  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const anioActual = hoy.getFullYear()

  props.transacciones
    .filter(t => {
      const fecha = parseLocalDate(t.fecha)
      return t.tipo === 'gasto' && 
             fecha.getMonth() === mesActual && 
             fecha.getFullYear() === anioActual
    })
    .forEach(t => {
      const dia = parseLocalDate(t.fecha).getDate()
      const semana = Math.min(Math.floor((dia - 1) / 7), 3)
      totales[semana] += t.monto
    })
  return totales
})

const gastosAnual = computed(() => {
  const totales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const anioActual = new Date().getFullYear()

  props.transacciones
    .filter(t => {
      const fecha = parseLocalDate(t.fecha)
      return t.tipo === 'gasto' && fecha.getFullYear() === anioActual
    })
    .forEach(t => {
      const mes = parseLocalDate(t.fecha).getMonth()
      totales[mes] += t.monto
    })
  return totales
})

const datosGrafico = computed(() => {
  if (periodoSeleccionado.value === 'semanal') return gastosSemanal.value
  if (periodoSeleccionado.value === 'mensual') return gastosMensual.value
  return gastosAnual.value
})

const labelsGrafico = computed(() => {
  if (periodoSeleccionado.value === 'semanal') return labelsSemanal
  if (periodoSeleccionado.value === 'mensual') return labelsMensual
  return labelsAnual
})

const chartData = computed(() => ({
  labels: labelsGrafico.value,
  datasets: [
    {
      data: datosGrafico.value,
      backgroundColor: datosGrafico.value.map(valor => {
        const max = Math.max(...datosGrafico.value)
        return valor === max ? '#7B1E2E' : '#EF4444'
      }),
      borderRadius: 8
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(15,23,42,0.05)' },
      ticks: { color: '#64748b', font: { family: 'Work Sans', size: 11 } }
    },
    x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Work Sans', size: 11 } } }
  }
}
</script>

<template>
  <div class="grafico-container">
    <div class="grafico-header">
      <h3>Tendencia de Gastos</h3>
      <div class="toggle-periodo">
        <button :class="{ activo: periodoSeleccionado === 'semanal' }" @click="periodoSeleccionado = 'semanal'">Semanal</button>
        <button :class="{ activo: periodoSeleccionado === 'mensual' }" @click="periodoSeleccionado = 'mensual'">Mensual</button>
        <button :class="{ activo: periodoSeleccionado === 'anual' }" @click="periodoSeleccionado = 'anual'">Anual</button>
      </div>
    </div>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.grafico-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-periodo {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.toggle-periodo button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.toggle-periodo button.activo {
  background: white;
  color: #006a61;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
</style>