<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">💰</span>
      <span class="logo-text">Finanzas Pro</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="nav-item" :class="{ activo: route.path === '/dashboard' }">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Dashboard</span>
      </RouterLink>

      <RouterLink to="/transacciones" class="nav-item" :class="{ activo: route.path === '/transacciones' }">
        <span class="nav-icon">💳</span>
        <span class="nav-label">Transacciones</span>
      </RouterLink>

      <RouterLink to="/estadisticas" class="nav-item" :class="{ activo: route.path === '/estadisticas' }">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Estadísticas y Análisis</span>
      </RouterLink>

      <RouterLink to="/configuracion" class="nav-item" :class="{ activo: route.path === '/configuracion' }">
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">Configuración</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 32px;
  z-index: 100;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
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
</style>
