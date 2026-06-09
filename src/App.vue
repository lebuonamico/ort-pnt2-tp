<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'
import { useSidebar } from './composables/useSidebar'
const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
const hideSideBar = computed(() => route.meta.hideSideBar === true)
const { colapsado } = useSidebar()
const sidebarWidth = computed(() =>
  hideSideBar.value ? '0px' : (colapsado.value ? '72px' : '240px')
)
</script>

<template>
  <div class="app-layout" :style="{ '--sidebar-width': sidebarWidth }">
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

.app-main {
  padding-top: var(--navbar-height);
  background: #f8f9ff;
  margin-left: var(--sidebar-width, 0);
  transition: margin-left 0.2s ease;
}

.app-main-full {
  padding-top: 0;
}
</style>