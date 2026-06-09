<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSidebar } from '../composables/useSidebar'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { colapsado, toggleSidebar } = useSidebar()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar" :class="{ colapsado }">
    <div class="sidebar-logo">
      <span class="logo-icon">💰</span>
      <span v-show="!colapsado" class="logo-text">Finanzas Pro</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        to="/dashboard"
        class="nav-item"
        :class="{ activo: route.path === '/dashboard' }"
      >
        <span class="nav-icon">🏠</span>
        <span v-show="!colapsado" class="nav-label">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/movimientos"
        class="nav-item"
        :class="{ activo: route.path === '/movimientos' }"
      >
        <span class="nav-icon">💳</span>
        <span v-show="!colapsado" class="nav-label">Movimientos</span>
      </RouterLink>

      <RouterLink
        to="/estadisticas"
        class="nav-item"
        :class="{ activo: route.path === '/estadisticas' }"
      >
        <span class="nav-icon">📊</span>
        <span v-show="!colapsado" class="nav-label">Estadísticas y Análisis</span>
      </RouterLink>

      <RouterLink
        v-if="authStore.isAdmin"
        to="/admin"
        class="nav-item"
        :class="{ activo: route.path.startsWith('/admin') }"
      >
        <span class="nav-icon">🛡️</span>
        <span v-show="!colapsado" class="nav-label">Admin</span>
      </RouterLink>
    </nav>

    <button class="nav-item sidebar-toggle" @click="toggleSidebar">
      <span class="material-symbols-outlined toggle-icon" :class="{ rotado: colapsado }">chevron_left</span>
      <span v-show="!colapsado" class="nav-label">Replegar</span>
    </button>

    <button class="nav-item logout-btn" @click="handleLogout">
      <span class="nav-icon">🚪</span>
      <span v-show="!colapsado" class="nav-label">Cerrar Sesión</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width, 240px);
  height: 100vh;
  box-sizing: border-box;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 100;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.2s ease;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: white;
  font-family: 'Manrope', sans-serif;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #94a3b8;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: white;
}

.nav-item.activo {
  background: #006a61;
  color: white;
}

.nav-icon {
  font-size: 18px;
}

.sidebar-toggle {
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  color: #94a3b8;
  margin-bottom: 8px;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.07);
  color: white;
}

.toggle-icon {
  font-size: 20px;
  transition: transform 0.2s ease;
}

.toggle-icon.rotado {
  transform: rotate(180deg);
}

.logout-btn {
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  color: #94a3b8;
  margin-bottom: 16px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  color: white;
}

.sidebar.colapsado .nav-item {
  justify-content: center;
  padding: 12px 0;
}

.sidebar.colapsado .sidebar-logo {
  justify-content: center;
  padding: 0;
}
</style>
