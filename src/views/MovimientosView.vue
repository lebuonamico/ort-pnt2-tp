<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransacciones } from '../composables/useTransacciones'

const { transacciones, obtenerTransacciones } = useTransacciones()

const busqueda = ref('')
const filtroCategoria = ref('Todas')
const filtroTipo = ref('Todos')
const filtroFecha = ref('30')
const paginaActual = ref(1)
const porPagina = 10

const categorias = ['Todas', 'Comida y Bebida', 'Transporte', 'Salud', 'Entretenimiento', 'Educación', 'Otros']

const iconosPorCategoria = {
  'Comida y Bebida': '🍴',
  'Transporte': '🚗',
  'Salud': '❤️',
  'Entretenimiento': '🎬',
  'Educación': '📚',
  'Otros': '📦',
  'Ingresos': '💰',
}

const transaccionesFiltradas = computed(() => {
  const hoy = new Date()
  return transacciones.value.filter(t => {
    const coincideBusqueda = t.concepto?.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = filtroCategoria.value === 'Todas' || t.categoria === filtroCategoria.value
    const coincideTipo = filtroTipo.value === 'Todos' || t.tipo === filtroTipo.value
    const fecha = new Date(t.fecha)
    const diasAtras = new Date()
    diasAtras.setDate(hoy.getDate() - parseInt(filtroFecha.value))
    const coincideFecha = fecha >= diasAtras
    return coincideBusqueda && coincideCategoria && coincideTipo && coincideFecha
  })
})

const totalPaginas = computed(() => Math.ceil(transaccionesFiltradas.value.length / porPagina))

const transaccionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return transaccionesFiltradas.value.slice(inicio, inicio + porPagina)
})

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatearMonto(monto, tipo) {
  const signo = tipo === 'ingreso' ? '+' : '-'
  return `${signo}$${monto.toFixed(2)}`
}

function cambiarPagina(n) {
  if (n >= 1 && n <= totalPaginas.value) paginaActual.value = n
}

onMounted(() => {
  obtenerTransacciones()
})
</script>

<template>
  <div class="movimientos">
    <h2>Movimientos</h2>
    <p class="subtitulo">Consultá y gestioná tu historial de transacciones detallado.</p>

    <div class="filtros-container">
      <div class="filtro-grupo">
        <label>Buscar</label>
        <div class="input-wrapper">
          <span class="icono-buscar">🔍</span>
          <input v-model="busqueda" type="text" placeholder="Nombre de transacción..." class="input-busqueda" />
        </div>
      </div>
      <div class="filtro-grupo">
        <label>Fecha</label>
        <select v-model="filtroFecha" class="select-filtro">
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 3 meses</option>
          <option value="365">Este año</option>
        </select>
      </div>
      <div class="filtro-grupo">
        <label>Categoría</label>
        <select v-model="filtroCategoria" class="select-filtro">
          <option v-for="cat in categorias" :key="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="filtro-grupo">
        <label>Tipo</label>
        <select v-model="filtroTipo" class="select-filtro">
          <option>Todos</option>
          <option>ingreso</option>
          <option>gasto</option>
        </select>
      </div>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>FECHA</th>
          <th>CONCEPTO</th>
          <th>CATEGORÍA</th>
          <th>MONTO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transaccionesPaginadas" :key="t.id">
          <td>{{ formatearFecha(t.fecha) }}</td>
          <td class="td-concepto">
            <span class="icono-cat">{{ iconosPorCategoria[t.categoria] ?? '📦' }}</span>
            {{ t.concepto }}
          </td>
          <td>
            <span class="badge" :class="t.tipo">{{ t.categoria }}</span>
          </td>
          <td :class="t.tipo === 'ingreso' ? 'positivo' : 'negativo'">
            {{ formatearMonto(t.monto, t.tipo) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="tabla-footer">
      <p class="total">Mostrando {{ (paginaActual - 1) * porPagina + 1 }} a {{ Math.min(paginaActual * porPagina, transaccionesFiltradas.length) }} de {{ transaccionesFiltradas.length }}</p>
      <div class="paginacion">
        <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">‹</button>
        <button v-for="n in totalPaginas" :key="n" @click="cambiarPagina(n)" :class="{ activa: n === paginaActual }">{{ n }}</button>
        <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movimientos { padding: 40px 32px; }
h2 { font-size: 24px; font-weight: 700; color: #0f172a; }
.subtitulo { color: #64748b; margin-bottom: 24px; }

.filtros-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filtro-grupo { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.filtro-grupo label { font-size: 12px; font-weight: 600; color: #64748b; }

.input-wrapper { position: relative; }
.icono-buscar { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; }
.input-busqueda { padding: 8px 12px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }
.select-filtro { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }

.tabla { width: 100%; border-collapse: collapse; }
thead th { text-align: left; font-size: 12px; color: #94a3b8; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
tbody td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; }
.td-concepto { display: flex; align-items: center; gap: 10px; }
.icono-cat { font-size: 20px; background: #f1f5f9; padding: 6px; border-radius: 8px; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.ingreso { background: #dcfce7; color: #16a34a; }
.badge.gasto { background: #fef3c7; color: #d97706; }
.positivo { color: #006a61; font-weight: 700; }
.negativo { color: #ef4444; font-weight: 700; }

.tabla-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
.total { font-size: 13px; color: #94a3b8; }
.paginacion { display: flex; gap: 4px; }
.paginacion button { padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; cursor: pointer; font-size: 14px; }
.paginacion button.activa { background: #006a61; color: white; border-color: #006a61; }
.paginacion button:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 768px) {
  .movimientos { padding: 16px; }
  .filtros-container { flex-direction: column; }
  .input-busqueda { width: 100%; }
  .select-filtro { width: 100%; }
  thead th:nth-child(1), tbody td:nth-child(1) { display: none; }
  .tabla { font-size: 12px; }
  tbody td { padding: 10px 6px; }
}
</style>