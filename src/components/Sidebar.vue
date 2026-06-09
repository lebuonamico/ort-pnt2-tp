<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">💰</span>
      <span class="logo-text">Finanzas Pro</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        to="/dashboard"
        class="nav-item"
        :class="{ activo: route.path === '/dashboard' }"
      >
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/movimientos"
        class="nav-item"
        :class="{ activo: route.path === '/movimientos' }"
      >
        <span class="nav-icon">💳</span>
        <span class="nav-label">Movimientos</span>
      </RouterLink>

      <RouterLink
        to="/estadisticas"
        class="nav-item"
        :class="{ activo: route.path === '/estadisticas' }"
      >
        <span class="nav-icon">📊</span>
        <span class="nav-label">Estadísticas y Análisis</span>
      </RouterLink>
    </nav>

    <button class="nav-item logout-btn" @click="handleLogout">
      <span class="nav-icon">🚪</span>
      <span class="nav-label">Cerrar Sesión</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  box-sizing: border-box;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 100;
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
</style>