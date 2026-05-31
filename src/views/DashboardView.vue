<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NuevaTransaccion from '../components/NuevaTransaccion.vue'
import Card from '../components/Card.vue'
import { useTransacciones } from '../composables/useTransacciones'
import { onMounted } from 'vue'
import ListaMovimientos from '../components/ListaMovimientos.vue'
import GraficoGastos from '../components/GraficoGastos.vue'

const mostrarModal = ref(false) //elige si muestra o no el popup de nueva transaccion

const { transacciones, obtenerTransacciones, saldoTotal, ingresosMes, gastosMes, porcentajeCambioSaldo } = useTransacciones()
const fechaHoy = new Date().toLocaleDateString('es-AR', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
})
onMounted(() => {
  obtenerTransacciones()
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
  <h1>Resumen General</h1>
  <p>Actualizado al {{ fechaHoy }}</p>
</div>

<div class="cards">
<Card titulo="SALDO TOTAL" :monto="saldoTotal" icono="🏦">
  <span class="badge-porcentaje">+{{ porcentajeCambioSaldo }}% vs mes anterior</span>
</Card>

<Card titulo="INGRESOS DEL MES" :monto="ingresosMes" icono="💰">
  <p>75% de la meta mensual (FALTA SETEAR EN SUPABASE)</p>
</Card>

<Card titulo="GASTOS DEL MES" :monto="gastosMes" icono="💸">
  <p>Dentro del presupuesto (FALTA SETEAR PRESUPUESTO EN SUPABASE)</p>
</Card>
</div>

<div class="contenido">
 <div class="grafico">
  <GraficoGastos :transacciones="transacciones" />
</div>
  <ListaMovimientos :transacciones="transacciones" />
</div>
    
  <div class="btn-wrapper">
    <PrimaryButton :fullWidth="false" @click="handleNuevaTransaccion">
      Añadir nueva transacción
    </PrimaryButton>
  </div>
    <NuevaTransaccion
      :show="mostrarModal"
      @close="mostrarModal = false"
    />
  </div>
  

 
</template>

<style scoped>
.cards {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.cards > * {
  flex: 1;
  min-height: 240px;
  max-height: 240px;
}
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lista-movimientos {
  width: 100%;
}

.contenido {
  display: flex;
  gap: 24px;
}

.grafico {
  flex: 2;
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-height: 400px;
}
.dashboard-container > .btn-wrapper {
  align-self: flex-start;
}
.header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
}

.header p {
  color: #94a3b8;
  font-size: 14px;
}
.badge-porcentaje {
  display: inline-flex;
  align-items: center;
  background: #d1fae5;
  color: #006a61;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
</style>