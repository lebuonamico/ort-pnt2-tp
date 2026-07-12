<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSidebar } from '../composables/useSidebar'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { colapsado, toggleSidebar, cerrarSidebar } = useSidebar()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar" :class="{ colapsado }">
    <div class="sidebar-logo" :class="{ colapsado }">
      <span v-show="!colapsado" class="logo-text">Finanzas Pro</span>
    </div>

    <div class="sidebar-user" :class="{ colapsado }">
      <div class="user-avatar">{{ authStore.userName.charAt(0).toUpperCase() }}</div>
      <div v-show="!colapsado" class="user-info">
<span class="user-name">{{ authStore.userName }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        to="/dashboard"
        class="nav-item" @click="cerrarSidebar"
        :class="{ activo: route.path === '/dashboard' }"
      >
        <span class="nav-icon">🏠</span>
        <span v-show="!colapsado" class="nav-label">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/movimientos"
        class="nav-item" @click="cerrarSidebar"
        :class="{ activo: route.path === '/movimientos' }"
      >
        <span class="nav-icon">💳</span>
        <span v-show="!colapsado" class="nav-label">Movimientos</span>
      </RouterLink>

      <RouterLink
        to="/estadisticas"
        class="nav-item" @click="cerrarSidebar"
        :class="{ activo: route.path === '/estadisticas' }"
      >
        <span class="nav-icon">📊</span>
        <span v-show="!colapsado" class="nav-label">Estadísticas y Análisis</span>
      </RouterLink>

      <RouterLink
        v-if="authStore.isAdmin"
        to="/admin"
        class="nav-item" @click="cerrarSidebar"
        :class="{ activo: route.path.startsWith('/admin') }"
      >
        <span class="nav-icon">🛡️</span>
        <span v-show="!colapsado" class="nav-label">Admin</span>
      </RouterLink>
    </nav>

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
  width: min(240px, 82vw);
  height: 100vh;
  box-sizing: border-box;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 100;
  overflow: hidden;
  white-space: nowrap;
  transition: transform 0.2s ease;
}

.sidebar.colapsado {
  transform: translateX(-100%);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 20px;
}

.sidebar-logo.colapsado {
  justify-content: center;
  padding: 0;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 20px;
}

.sidebar-user.colapsado {
  justify-content: center;
  padding: 0;
}

.user-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}

.user-plan {
  font-family: 'Work Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.user-name {
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  color: var(--color-text-secondary);
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}

.nav-item:hover {
  background: var(--color-accent-soft);
  color: var(--color-text-primary);
}

.nav-item.activo {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 600;
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
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.logout-btn:hover {
  background: var(--color-accent-soft);
  color: var(--color-text-primary);
}


</style>
