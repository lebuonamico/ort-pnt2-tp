<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const auth = useAuthStore()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
</script>

<template>
  <div class="app-layout">
    <Navbar v-if="!hideNavbar && !auth.isAuthenticated" />
    <Sidebar v-if="auth.isAuthenticated" />
    <main :class="['app-main', { 'app-main-full': hideNavbar, 'con-sidebar': auth.isAuthenticated }]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-main {
  padding-top: var(--navbar-height);
  background: #f8f9ff;
}

.app-main-full {
  padding-top: 0;
}

.con-sidebar {
  margin-left: 220px;
  padding: 32px;
}
</style>