<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  }
})

const periodoSeleccionado = ref('semanal')

// Labels por periodo
const labelsSemanal = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const labelsMensual = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
const labelsAnual = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Computed semanal
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
      const fecha = new Date(t.fecha)
      return t.tipo === 'gasto' && fecha >= inicioSemana && fecha <= finSemana
    })
    .forEach(t => {
      const dia = new Date(t.fecha).getDay()
      const indice = dia === 0 ? 6 : dia - 1
      totales[indice] += t.monto
    })
  return totales
})

// Computed mensual (agrupa por semana del mes actual)
const gastosMensual = computed(() => {
  const totales = [0, 0, 0, 0]
  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const anioActual = hoy.getFullYear()

  props.transacciones
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'gasto' && 
             fecha.getMonth() === mesActual && 
             fecha.getFullYear() === anioActual
    })
    .forEach(t => {
      const dia = new Date(t.fecha).getDate()
      const semana = Math.min(Math.floor((dia - 1) / 7), 3)
      totales[semana] += t.monto
    })
  return totales
})

// Computed anual (agrupa por mes)
const gastosAnual = computed(() => {
  const totales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const anioActual = new Date().getFullYear()

  props.transacciones
    .filter(t => {
      const fecha = new Date(t.fecha)
      return t.tipo === 'gasto' && fecha.getFullYear() === anioActual
    })
    .forEach(t => {
      const mes = new Date(t.fecha).getMonth()
      totales[mes] += t.monto
    })
  return totales
})

// Computed final que elige según periodo
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
        return valor === max ? '#fca5a5' : '#006a61'
      }),
      borderRadius: 8
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { display: false },
    x: { grid: { display: false } }
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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.grafico-container {
  height: 100%;
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