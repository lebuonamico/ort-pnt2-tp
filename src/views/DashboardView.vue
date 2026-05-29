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
    <h1>Hola {{ auth.userName }}</h1>
    <p v-if="auth.isAdmin" class="admin-message">
      Bienvenido administrador. Tenes permisos especiales en el sistema.
    </p>
    <p>Esta es una vista protegida que solo los usuarios autenticados pueden ver.</p>
  </div>

    <button v-if="auth.isAuthenticated" @click="handleSignOut()">Cerrar sesión</button>
    <span v-else>No autenticado</span>

 
</template>

<style scoped>
.admin-message {
  width: fit-content;
  max-width: 100%;
  margin: 16px 0;
  padding: 12px 16px;
  border: 1px solid #8ad7c1;
  border-radius: 8px;
  background: #e8fff7;
  color: #065f4d;
  font-weight: 600;
}
</style>
