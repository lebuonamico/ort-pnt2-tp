<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import AiChatWidget from './components/AiChatWidget.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useSidebar } from './composables/useSidebar'
import { useAuthStore } from './stores/auth'
const route = useRoute()
const auth = useAuthStore()
const hideNavbar = computed(() => route.meta.hideNavbar === true)
const hideSidebar = computed(() => route.meta.hideSidebar === true)
const mostrarChatIa = computed(() => auth.isAuthenticated && !hideSidebar.value)
const { colapsado, toggleSidebar, cerrarSidebar } = useSidebar()

const isMobile = ref(false)
let mql = null
function aplicarModo() {
  const eraMobile = isMobile.value
  isMobile.value = mql.matches
  // Al pasar a mobile, cerrar el drawer para que no tape el contenido al cargar.
  if (isMobile.value && !eraMobile) cerrarSidebar()
}
onMounted(() => {
  mql = window.matchMedia('(max-width: 768px)')
  isMobile.value = mql.matches
  if (isMobile.value) cerrarSidebar()
  mql.addEventListener('change', aplicarModo)
})
onUnmounted(() => {
  if (mql) mql.removeEventListener('change', aplicarModo)
})

const sidebarWidth = computed(() => {
  if (isMobile.value) return '0px'
  if (hideSidebar.value || colapsado.value) return '0px'
  return '240px'
})
</script>

<template>
  <div class="app-layout" :style="{ '--sidebar-width': sidebarWidth }">
    <Sidebar v-if="!hideSidebar" />

    <div
      v-if="!hideSidebar && isMobile && !colapsado"
      class="sidebar-backdrop"
      @click="cerrarSidebar"
    ></div>

    <button
      v-if="!hideSidebar"
      class="sidebar-toggle-bar"
      @click="toggleSidebar"
      :title="colapsado ? 'Expandir' : 'Colapsar'"
    >
      <span class="material-symbols-outlined toggle-bar-icon" :class="{ rotado: colapsado }">chevron_left</span>
    </button>

    <Navbar v-if="!hideNavbar" />

    <ThemeToggle v-if="hideNavbar" class="theme-toggle-floating" />

    <main :class="['app-main', { 'app-main-full': hideNavbar }]">
      <RouterView />
    </main>

    <AiChatWidget v-if="mostrarChatIa" />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-main {
  padding-top: var(--navbar-height);
  background: var(--color-bg-page);
  margin-left: var(--sidebar-width, 0);
  transition: margin-left 0.2s ease, background 0.2s ease;
}

.theme-toggle-floating {
  position: fixed;
  top: 14px;
  right: 16px;
  z-index: 1001;
}

.app-main-full {
  padding-top: 0;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-backdrop);
  z-index: 99;
}

@media (max-width: 768px) {
  .app-main {
    margin-left: 0 !important;
  }
}

.sidebar-toggle-bar {
  position: fixed;
  left: calc(var(--sidebar-width) - 1px);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 72px;
  background: var(--color-accent);
  border: none;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  box-shadow: 3px 0 8px rgba(0, 106, 97, 0.25);
  padding: 0;
  transition: left 0.2s ease, background 0.15s;
}

.sidebar-toggle-bar:hover {
  background: var(--color-accent-hover);
}

.toggle-bar-icon {
  font-size: 22px;
  color: var(--color-on-accent);
  transition: transform 0.2s ease;
  line-height: 1;
}

.toggle-bar-icon.rotado {
  transform: rotate(180deg);
}
</style>
