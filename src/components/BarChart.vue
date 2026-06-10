<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  labels:        { type: Array,  default: () => [] },
  data:          { type: Array,  default: () => [] },
  datosIngresos: { type: Array,  default: () => [] },
  label:         { type: String, default: 'Movimientos' }
})

const multiMode = computed(() => props.datosIngresos.length > 0)

const chartData = computed(() => {
  if (multiMode.value) {
    const saldo = props.datosIngresos.map((ing, i) => ing - (props.data[i] || 0))
    return {
      labels: props.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: props.datosIngresos,
          backgroundColor: '#1D9E75',
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 28
        },
        {
          label: 'Gastos',
          data: props.data,
          backgroundColor: '#D85A30',
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 28
        },
        {
          label: 'Saldo',
          data: saldo,
          backgroundColor: '#378ADD',
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 28
        }
      ]
    }
  }

  const highlightedIndex = props.data.indexOf(Math.max(...props.data))
  return {
    labels: props.labels,
    datasets: [{
      label: props.label,
      data: props.data,
      backgroundColor: props.data.map((_, i) =>
        i === highlightedIndex ? '#006a61' : 'rgba(0, 106, 97, 0.18)'
      ),
      hoverBackgroundColor: '#006a61',
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 36
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: multiMode.value },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { family: 'Work Sans' },
      bodyFont: { family: 'Work Sans' },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-AR')}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { family: 'Work Sans', size: 11 } }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(15,23,42,0.05)' },
      ticks: { color: '#64748b', font: { family: 'Work Sans', size: 11 } }
    }
  }
}))
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
}
</style>