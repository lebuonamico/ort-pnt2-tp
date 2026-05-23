<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

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
  </div>

    <button v-if="auth.isAuthenticated" @click="handleSignOut()">Cerrar sesión</button>
    <span v-else>No autenticado</span>

 
</template>