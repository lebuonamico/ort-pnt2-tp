<script setup>
import {useAuth} from '../composables/useAuth.js'
import { useRouter } from 'vue-router'

const { isAuthenticated, signOut, user } = useAuth()
const router = useRouter()
const handleSignOut = async () => {

  try {
    console.log('Sesion cerrada 1')
    await signOut()
    console.log('Sesion cerrada 2')
    router.push("/login")
    console.log('Sesion cerrada')

  } catch (error) {
  }
}
</script>


<template>
    <div class="dashboard-container">
        <h1>Bienvenido al Dashboard</h1>
        <p>Esta es una vista protegida que solo los usuarios autenticados pueden ver.</p>
    </div>

    <div v-if="isAuthenticated">
    
    <p>
    Usuario autenticado:
    {{ user?.email }}
    </p>
    
    <button @click="handleSignOut">
    Sign Out
    </button>
    
    </div>
</template>