<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'
const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
const hideSideBar = computed(() => route.meta.hideSideBar === true)
</script>

<template>
  <div class="app-layout">
    <SideBar v-if="!hideSideBar" />
    <Navbar v-if="!hideNavbar" />
    
    <main :class="['app-main', { 'app-main-full': hideNavbar }]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-main { padding-top: var(--navbar-height); background: #f8f9ff; }

.app-main-full {
  padding-top: 0;
}
</style>