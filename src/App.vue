<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
const auth = useAuthStore()

onMounted(() => {
  auth.initAuthListener()
})
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-main {
  padding-top: 92px;
  min-height: calc(100vh - 92px);
  background: #f8f9ff;
}
</style>
