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
.app-layout{
  position:relative;
  height:100%;
}

.app-main {
  position:absolute;
  top:var(--navbar-height);
  left:0;
  right:0;
  bottom:0;
  background: #f8f9ff;
  overflow:auto;
}
</style>
