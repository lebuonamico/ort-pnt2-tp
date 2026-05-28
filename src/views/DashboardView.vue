<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NuevaTransaccion from '../components/NuevaTransaccion.vue'

const mostrarModal = ref(false) //elige si muestra o no el popup de nueva transaccion

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


<template>
  <div class="dashboard-container">
    <h1>Bienvenido al Dashboard</h1>
    <p>Esta es una vista protegida que solo los usuarios autenticados pueden ver.</p>
  

    <button v-if="auth.isAuthenticated" @click="handleSignOut()">Cerrar sesión</button>
    <span v-else>No autenticado</span>

    <PrimaryButton :fullWidth="false" @click="handleNuevaTransaccion">
    Añadir nueva transacción
    </PrimaryButton>
    <NuevaTransaccion
      :show="mostrarModal"
      @close="mostrarModal = false"
    />
  </div>
  

 
</template>