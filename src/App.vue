<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'
import { useSidebar } from './composables/useSidebar'
const route = useRoute()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
const hideSideBar = computed(() => route.meta.hideSideBar === true)
const { colapsado, toggleSidebar } = useSidebar()
const sidebarWidth = computed(() => {
  if (hideSideBar.value || colapsado.value) return '0px'
  return '240px'
})
</script>

<template>
  <div class="app-layout" :style="{ '--sidebar-width': sidebarWidth }">
    <SideBar v-if="!hideSideBar" />

    <button
      v-if="!hideSideBar"
      class="sidebar-toggle-bar"
      @click="toggleSidebar"
      :title="colapsado ? 'Expandir' : 'Colapsar'"
    >
      <span class="material-symbols-outlined toggle-bar-icon" :class="{ rotado: colapsado }">chevron_left</span>
    </button>

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

.sidebar-toggle-bar {
  position: fixed;
  left: calc(var(--sidebar-width) - 1px);
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 52px;
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  box-shadow: 2px 0 6px rgba(15, 23, 42, 0.08);
  padding: 0;
  transition: left 0.2s ease, background 0.15s;
}

.sidebar-toggle-bar:hover {
  background: #ebf3f2;
}

.toggle-bar-icon {
  font-size: 16px;
  color: #64748b;
  transition: transform 0.2s ease;
  line-height: 1;
}

.toggle-bar-icon.rotado {
  transform: rotate(180deg);
}
</style>