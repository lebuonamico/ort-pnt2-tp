<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useChartColors } from '../../composables/useChartColors'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartColors = useChartColors()

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'Movimientos'
  }
})

const highlightedIndex = computed(() => {
  if (!props.data.length) return -1
  return props.data.indexOf(Math.max(...props.data))
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      backgroundColor: props.data.map((_, i) =>
        i === highlightedIndex.value ? '#006a61' : 'rgba(0, 106, 97, 0.18)'
      ),
      hoverBackgroundColor: '#006a61',
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 36
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.tooltipBg.value,
      titleFont: { family: 'Work Sans' },
      bodyFont: { family: 'Work Sans' },
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: chartColors.tick.value,
        font: { family: 'Work Sans', size: 11 }
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: chartColors.grid.value },
      ticks: {
        color: chartColors.tick.value,
        font: { family: 'Work Sans', size: 11 }
      }
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
