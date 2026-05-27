<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PrimaryButton from '../components/PrimaryButton.vue'

const router = useRouter()
const auth = useAuthStore()

const goHome = () => {
  router.push(auth.isAuthenticated ? '/dashboard' : '/')
}
</script>

<template>
  <div class="not-found-page">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>La página que estás buscando no existe.</p>
    <div class="actions">
      <PrimaryButton
        :fullWidth="false"
        @click="goHome"
      >
        Ir al Inicio
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  text-align: center;
  padding: 4rem 2rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #006a61;
}

h2 {
  margin: 0 0 1rem 0;
}

p {
  color: #45464d;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
