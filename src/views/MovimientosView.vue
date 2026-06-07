<script setup>
import { onMounted } from 'vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useMovimientos } from '../composables/useMovimientos'
import { useCategories } from '../composables/useCategories'
import FilaMovimiento from '../components/FilaMovimiento.vue'
import Paginacion from '../components/Paginacion.vue'

const { transacciones, obtenerTransacciones } = useTransacciones()
const {
  busqueda,
  filtroCategoria,
  filtroTipo,
  filtroFecha,
  paginaActual,
  porPagina,
  transaccionesFiltradas,
  totalPaginas,
  transaccionesPaginadas,
  cambiarPagina,
} = useMovimientos(transacciones)

const { categorias, cargarCategorias } = useCategories()

onMounted(async () => {
  await Promise.all([obtenerTransacciones(), cargarCategorias()])
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
          <option value="9999">Todo el tiempo</option>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 3 meses</option>
          <option value="365">Este año</option>
        </select>
      </div>
      <div class="filtro-grupo">
        <label>Categoría</label>
        <select v-model="filtroCategoria" class="select-filtro">
          <option value="Todas">Todas</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.nombre">{{ cat.nombre }}</option>
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
        <FilaMovimiento v-for="t in transaccionesPaginadas" :key="t.id" :transaccion="t" />
      </tbody>
    </table>

    <Paginacion
      v-if="totalPaginas > 1"
      :paginaActual="paginaActual"
      :totalPaginas="totalPaginas"
      :totalItems="transaccionesFiltradas.length"
      :porPagina="porPagina"
      @cambiar="cambiarPagina"
    />
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


@media (max-width: 768px) {
  .movimientos { padding: 16px; }
  .filtros-container { flex-direction: column; }
  .input-busqueda { width: 100%; }
  .select-filtro { width: 100%; }
  thead th:nth-child(1), thead th:nth-child(1) { display: none; }
  .tabla { font-size: 12px; }
}
</style>
