<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NuevaTransaccion from '../components/NuevaTransaccion.vue'
import Card from '../components/Card.vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useCategories } from '../composables/useCategories'
import { onMounted } from 'vue'
import ListaMovimientos from '../components/ListaMovimientos.vue'
import GraficoGastos from '../components/GraficoGastos.vue'
import iconoSaldo from '../assets/1.png'
import iconoIngresos from '../assets/2.png'
import iconoGastos from '../assets/3.png'

const mostrarModal = ref(false) //elige si muestra o no el popup de nueva transaccion

const { transacciones, obtenerTransacciones, saldoTotal, ingresosMes, gastosMes, porcentajeCambioSaldo, porcentajeCambioIngresos, porcentajeCambioGastos } = useTransacciones()
const { cargarCategorias } = useCategories()
const fechaHoy = new Date().toLocaleDateString('es-AR', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
})
onMounted(() => {
  obtenerTransacciones()
  cargarCategorias()
})

const handleNuevaTransaccion = () => {
  mostrarModal.value = true}


const auth = useAuthStore()
const router = useRouter()
const handleSignOut = async () => {

  try {
    await auth.logout()
    router.push({ name: 'login' })
  } catch (error) {
  }
}


</script>

<!-- HERO -->
<template>
  <div class="dashboard-container">
   <!-- <h1>Bienvenido al Dashboard</h1>
    <p>Esta es una vista protegida que solo los usuarios autenticados pueden ver.</p>
  

    <button v-if="auth.isAuthenticated" @click="handleSignOut()">Cerrar sesión</button>
    <span v-else>No autenticado</span> -->
<div class="header">
  <div class="header-text">
    <h1>Resumen General</h1>
    <p>Actualizado al {{ fechaHoy }}</p>
  </div>
  <PrimaryButton :fullWidth="false" @click="handleNuevaTransaccion">
    + Añadir transacción
  </PrimaryButton>
</div>

<div class="cards">
<Card titulo="SALDO TOTAL" :monto="saldoTotal" :imagen="iconoSaldo" :variacion="porcentajeCambioSaldo" />
<Card titulo="INGRESOS DEL MES" :monto="ingresosMes" :imagen="iconoIngresos" :variacion="porcentajeCambioIngresos" />
<Card titulo="GASTOS DEL MES" :monto="gastosMes" :imagen="iconoGastos" :variacion="porcentajeCambioGastos" :invertirVariacion="true" />
</div>

<div class="contenido">
 <div class="grafico">
  <GraficoGastos :transacciones="transacciones" />
</div>
  <ListaMovimientos :transacciones="transacciones" />
</div>
    <NuevaTransaccion
      :show="mostrarModal"
      @close="mostrarModal = false"
      @guardado="obtenerTransacciones"
    />
  </div>
  

 
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 32px;
  height: calc(100vh - var(--navbar-height));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-text p {
  color: #94a3b8;
  font-size: 13px;
  margin: 2px 0 0;
}

.cards {
  display: flex;
  gap: 16px;
  align-items: stretch;
  flex-shrink: 0;
}

.cards > * {
  flex: 1;
}

.contenido {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.grafico {
  flex: 2;
  background: white;
  border-radius: 16px;
  padding: 20px;
  min-height: 0;
  overflow: hidden;
}


@media (max-width: 768px) {
  .dashboard-container {
    height: auto;
    overflow: auto;
    padding: 16px;
  }
  .cards { flex-direction: column; }
  .contenido { flex-direction: column; }
}
</style>
