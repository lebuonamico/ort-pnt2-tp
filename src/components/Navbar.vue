<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PrimaryButton from './PrimaryButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const logoRoute = computed(() => 
  authStore.isAuthenticated ? '/dashboard' : '/'
)

const navLinks = computed(() => {
  if (!authStore.isAuthenticated) return []
  const links = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Movimientos', to: '/movimientos' },
    { label: 'Estadísticas', to: '/estadisticas' },
  ]
  if (authStore.isAdmin) {
    links.push({ label: 'Admin', to: '/admin' })
  }
  return links
})

const guestActions = computed(() => [
  {
    label: 'Ingresar',
    variant: route.name === 'login' ? 'primary' : 'outline',
    action: () => router.push('/login')
  },
  {
    label: 'Registro',
    variant: route.name === 'register' ? 'primary' : 'outline',
    action: () => router.push('/register')
  }
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">

      <RouterLink :to="logoRoute" class="logo">
        Finanzas Pro
      </RouterLink>

      <!-- Links centrados cuando está autenticado -->
      <div v-if="authStore.isAuthenticated" class="nav-links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Acciones a la derecha -->
      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated">
          <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
        </template>
        <template v-else>
          <PrimaryButton
            v-for="item in guestActions"
            :key="item.label"
            :variant="item.variant"
            :fullWidth="false"
            @click="item.action"
          >
            {{ item.label }}
          </PrimaryButton>
        </template>
      </div>

    </div>
  </nav>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  z-index: 1000;
  background: rgba(248,249,255,.78);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(198,198,205,.18);
}

.navbar-container {
  width: min(1200px, 100%);
  max-width: 1200px;
  box-sizing: border-box;
  margin: auto;
  padding: 0 24px;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.logo {
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  transition: .2s;
  justify-self: start;
}

.logo:hover {
  opacity: .8;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #45464d;
  position: relative;
  transition: .2s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #006a61;
}

.nav-link.router-link-active {
  color: #006a61;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 2px;
  background: #006a61;
  border-radius: 999px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;
  grid-column: 3;
}

.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #45464d;
  padding: 8px 12px;
  border-radius: 8px;
  transition: .2s;
}

.btn-logout:hover {
  color: #006a61;
  background: rgba(0,106,97,.08);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    grid-template-columns: auto 1fr auto;
    gap: 8px;
  }

  .logo {
    font-size: 19px;
  }

  .nav-links {
    gap: 16px;
    justify-content: center;
  }

  .nav-link {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 10px;
  }

  .nav-link {
    font-size: 12px;
  }
}

</style>
