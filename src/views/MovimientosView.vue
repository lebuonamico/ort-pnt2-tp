<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useMovimientos } from '../composables/useMovimientos'
import { useCategories } from '../composables/useCategories'
import FilaMovimiento from '../components/FilaMovimiento.vue'
import Paginacion from '../components/Paginacion.vue'
import NuevaTransaccion from '../components/NuevaTransaccion.vue'
import EstadoDatos from '../components/EstadoDatos.vue'

const { transacciones, cargando, errorCarga, obtenerTransacciones, eliminarTransaccion } = useTransacciones()
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

const categoriasPorTipo = computed(() => {
  if (filtroTipo.value === 'Todos') return categorias.value
  return categorias.value.filter(c => c.tipo === filtroTipo.value)
})

watch(filtroTipo, () => {
  if (filtroTipo.value === 'Todos' || filtroCategoria.value === 'Todas') return
  const cat = categorias.value.find(c => c.nombre === filtroCategoria.value)
  if (cat && cat.tipo !== filtroTipo.value) filtroCategoria.value = 'Todas'
})

watch(filtroCategoria, () => {
  if (filtroCategoria.value === 'Todas') return
  const cat = categorias.value.find(c => c.nombre === filtroCategoria.value)
  if (cat && cat.tipo !== filtroTipo.value) filtroTipo.value = cat.tipo
})

const mostrarModal = ref(false)
const transaccionAEditar = ref(null)

const mostrarConfirmar = ref(false)
const transaccionAEliminar = ref(null)

function handleEditar(transaccion) {
  transaccionAEditar.value = transaccion
  mostrarModal.value = true
}

function handleEliminar(transaccion) {
  transaccionAEliminar.value = transaccion
  mostrarConfirmar.value = true
}

async function confirmarEliminar() {
  const ok = await eliminarTransaccion(transaccionAEliminar.value.id)
  mostrarConfirmar.value = false
  transaccionAEliminar.value = null
  if (ok) await obtenerTransacciones()
}

function cancelarEliminar() {
  mostrarConfirmar.value = false
  transaccionAEliminar.value = null
}

function handleCerrarModal() {
  mostrarModal.value = false
  transaccionAEditar.value = null
}

async function handleGuardado() {
  mostrarModal.value = false
  transaccionAEditar.value = null
  await obtenerTransacciones()
}

onMounted(async () => {
  await Promise.all([obtenerTransacciones(), cargarCategorias()])
})
</script>

<template>
  <div class="app-page">

    <header class="app-page-header">
      <div class="app-page-header-inner">
        <p class="app-eyebrow">Finanzas Pro</p>
        <h1 class="app-page-title">Movimientos</h1>
        <p class="app-page-subtitle">Consultá y gestioná tu historial de transacciones detallado.</p>
      </div>
    </header>

    <div class="app-page-content">

      <div class="app-card filtros-container">
        <div class="filtro-grupo">
          <label for="busqueda">Buscar</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined icono-buscar">search</span>
            <input id="busqueda" v-model="busqueda" type="text" placeholder="Nombre de transacción..." class="input-busqueda" />
          </div>
        </div>
        <div class="filtro-grupo">
          <label for="filtro-fecha">Fecha</label>
          <select id="filtro-fecha" v-model="filtroFecha" class="select-filtro">
            <option value="9999">Todo el tiempo</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Este año</option>
          </select>
        </div>
        <div class="filtro-grupo">
          <label for="filtro-tipo">Tipo</label>
          <select id="filtro-tipo" v-model="filtroTipo" class="select-filtro">
            <option>Todos</option>
            <option>ingreso</option>
            <option>gasto</option>
          </select>
        </div>
        <div class="filtro-grupo">
          <label for="filtro-categoria">Categoría</label>
          <select id="filtro-categoria" v-model="filtroCategoria" class="select-filtro">
            <option value="Todas">Todas</option>
            <option v-for="cat in categoriasPorTipo" :key="cat.id" :value="cat.nombre">{{ cat.nombre }}</option>
          </select>
        </div>
      </div>

      <EstadoDatos :cargando="cargando" :error="errorCarga">
      <div class="app-card tabla-container">
        <table class="tabla">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>CONCEPTO</th>
              <th>CATEGORÍA</th>
              <th>MONTO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <FilaMovimiento
              v-for="t in transaccionesPaginadas"
              :key="t.id"
              :transaccion="t"
              @editar="handleEditar"
              @eliminar="handleEliminar"
            />
          </tbody>
        </table>

        <div class="paginacion-footer">
          <Paginacion
            v-if="totalPaginas > 1"
            :paginaActual="paginaActual"
            :totalPaginas="totalPaginas"
            :totalItems="transaccionesFiltradas.length"
            :porPagina="porPagina"
            @cambiar="cambiarPagina"
          />
        </div>
      </div>
      </EstadoDatos>

    </div>

    <NuevaTransaccion
      :show="mostrarModal"
      :transaccion="transaccionAEditar"
      @close="handleCerrarModal"
      @saved="handleGuardado"
    />

    <div v-if="mostrarConfirmar" class="overlay" @click.self="cancelarEliminar">
      <div class="confirmar-modal">
        <div class="confirmar-icono">🗑️</div>
        <h3>Eliminar transacción</h3>
        <p>¿Querés eliminar <strong>{{ transaccionAEliminar?.concepto }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="confirmar-footer">
          <button class="btn-cancelar" @click="cancelarEliminar">Cancelar</button>
          <button class="btn-eliminar" @click="confirmarEliminar">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.filtros-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.filtro-grupo label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.input-wrapper { position: relative; }

.icono-buscar {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--color-text-muted);
}

.input-busqueda {
  padding: 9px 12px 9px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-body);
  outline: none;
}

.input-busqueda:focus { border-color: var(--color-accent); }

.select-filtro {
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-body);
  outline: none;
}

.select-filtro:focus { border-color: var(--color-accent); }

.tabla-container {
  padding: 0;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.paginacion-footer {
  margin-top: auto;
  flex-shrink: 0;
}

thead th {
  text-align: left;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  letter-spacing: 0.04em;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.confirmar-modal {
  background: white;
  border-radius: var(--radius-card);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.confirmar-icono { font-size: 40px; }
.confirmar-modal h3 { font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--color-text-primary); margin: 0; }
.confirmar-modal p { font-family: var(--font-body); font-size: 14px; color: var(--color-text-muted); margin: 0; }

.confirmar-footer { display: flex; gap: 12px; margin-top: 8px; width: 100%; }

.btn-cancelar {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
}

.btn-eliminar {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #dc2626;
  color: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
}

.btn-cancelar:hover { background: #f8fafc; }
.btn-eliminar:hover { background: #b91c1c; }

.app-page {
  height: calc(100vh - var(--navbar-height));
  overflow: hidden;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

.app-page-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 16px;
}


@media (max-width: 768px) {
  .filtros-container { flex-direction: column; }
  thead th:nth-child(1) { display: none; }
  .tabla { font-size: 12px; }
}
</style>
