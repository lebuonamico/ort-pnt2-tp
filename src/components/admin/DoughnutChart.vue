<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useChartColors } from '../../composables/useChartColors'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartColors = useChartColors()

const PALETTE = [
  '#006a61',
  '#4edea3',
  '#6bd8cb',
  '#bec6e0',
  '#0f172a',
  '#86f2e4',
  '#3f465c',
  '#cbdbf5'
]

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.labels.map((_, i) => PALETTE[i % PALETTE.length]),
      borderColor: chartColors.surface.value,
      borderWidth: 3,
      hoverOffset: 8
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: chartColors.legend.value,
        font: { family: 'Work Sans', size: 12 },
        padding: 12,
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: chartColors.tooltipBg.value,
      titleFont: { family: 'Work Sans' },
      bodyFont: { family: 'Work Sans' },
      padding: 12,
      cornerRadius: 8
    }
  }
}))
</script>

<template>
  <div class="chart-wrapper">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
}
</style>
