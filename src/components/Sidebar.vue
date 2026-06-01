<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import NuevaTransaccion from './NuevaTransaccion.vue'

const auth = useAuthStore()
const router = useRouter()
const mostrarModal = ref(false)

async function cerrarSesion() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <!-- Área superior scrolleable -->
    <div class="sidebar-top">
      <div class="sidebar-logo">
        <span>💰</span>
        <span>Finanzas Pro</span>
      </div>

      <div class="sidebar-usuario">
        <div class="avatar">{{ auth.userEmail?.charAt(0).toUpperCase() }}</div>
        <div class="usuario-info">
          <p class="usuario-nombre">{{ auth.userEmail }}</p>
          <p class="usuario-plan">Plan Profesional</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/dashboard" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Resumen
        </RouterLink>
        <RouterLink to="/movimientos" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
          Movimientos
        </RouterLink>
        <RouterLink to="/estadisticas" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          Estadísticas
        </RouterLink>
        <RouterLink to="/configuracion" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          Configuración
        </RouterLink>
      </nav>

      <button class="btn-agregar" @click="mostrarModal = true">
        + Añadir Transacción
      </button>
    </div>

    <!-- Footer siempre visible -->
    <div class="sidebar-footer">
      <button class="nav-item btn-footer">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        Ayuda
      </button>
      <button class="nav-item btn-footer" @click="cerrarSesion">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        Cerrar sesión
      </button>
    </div>

    <NuevaTransaccion :show="mostrarModal" @close="mostrarModal = false" />
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-top {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 0 16px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  padding: 0 16px;
}

.sidebar-usuario {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #006a61;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.usuario-nombre {
  font-weight: 600;
  font-size: 12px;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 130px;
}

.usuario-plan { font-size: 11px; color: #94a3b8; }

.btn-agregar {
  background: #006a61;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 16px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 0;
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: background 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}

.nav-item:hover { background: #f1f5f9; color: #0f172a; }
.nav-item.router-link-active { background: #e6f4f3; color: #006a61; font-weight: 600; }

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0 16px;
  border-top: 1px solid #f1f5f9;
}
.btn-footer { color: #94a3b8; }
</style>