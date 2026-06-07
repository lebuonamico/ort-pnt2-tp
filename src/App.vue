<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
</script>

<template>
  <div class="app-layout">
    <Navbar v-if="!hideNavbar" />
    <main :class="['app-main', { 'app-main-full': hideNavbar }]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-main {
  flex: 1;
  padding-top: var(--navbar-height);
  background: #f8f9ff;
  overflow-y: auto;
}

.app-main-full {
  padding-top: 0;
}
</style>
