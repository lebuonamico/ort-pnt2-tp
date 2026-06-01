<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PrimaryButton from './PrimaryButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const menuAbierto = ref(false)

const cerrarMenu = () => { menuAbierto.value = false }

const actions = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: 'Dashboard', type: 'link', to: '/dashboard' },
      {
        label: 'Cerrar sesión',
        type: 'button',
        variant: 'outline',
        action: async () => {
          await authStore.logout()
          router.push('/login')
          cerrarMenu()
        }
      }
    ]
  }
  return [
    {
      label: 'Ingresar',
      type: 'button',
      variant: route.name === 'login' ? 'primary' : 'outline',
      action: () => { router.push('/login'); cerrarMenu() }
    },
    {
      label: 'Registrarse',
      type: 'button',
      variant: route.name === 'register' ? 'primary' : 'outline',
      action: () => { router.push('/register'); cerrarMenu() }
    }
  ]
})
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="logo">Finanzas Pro</RouterLink>

      <!-- Desktop -->
      <div class="nav-actions">
        <template v-for="item in actions" :key="item.label">
          <RouterLink v-if="item.type === 'link'" :to="item.to" class="dashboard-link">
            {{ item.label }}
          </RouterLink>
          <PrimaryButton v-else :variant="item.variant" :fullWidth="false" @click="item.action">
            {{ item.label }}
          </PrimaryButton>
        </template>
      </div>

      <!-- Hamburger (mobile) -->
      <button class="hamburger" :class="{ abierto: menuAbierto }" @click="menuAbierto = !menuAbierto" aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <div class="mobile-menu" :class="{ abierto: menuAbierto }">
      <template v-for="item in actions" :key="item.label">
        <RouterLink v-if="item.type === 'link'" :to="item.to" class="mobile-link" @click="cerrarMenu">
          {{ item.label }}
        </RouterLink>
        <button v-else class="mobile-btn" :class="item.variant" @click="item.action">
          {{ item.label }}
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--navbar-height);
  background: rgba(248, 249, 255, 0.78);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(198, 198, 205, 0.18);
  z-index: 1000;
  overflow: visible;
}

.navbar-container {
  width: min(1200px, 100%);
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  transition: 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-link {
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  color: #45464d;
  position: relative;
  transition: 0.2s;
}

.dashboard-link:hover {
  color: #006a61;
}

.router-link-active {
  color: #006a61;
}

.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 2px;
  background: #006a61;
  border-radius: 999px;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #0f172a;
  border-radius: 999px;
  transition: transform 0.2s, opacity 0.2s;
}

.hamburger.abierto span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.abierto span:nth-child(2) {
  opacity: 0;
}

.hamburger.abierto span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile dropdown */
.mobile-menu {
  display: none;
  position: absolute;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  flex-direction: column;
  gap: 4px;
  padding: 12px 24px 20px;
  background: rgba(248, 249, 255, 0.98);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(198, 198, 205, 0.18);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.mobile-menu.abierto {
  display: flex;
}

.mobile-link {
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  color: #45464d;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: color 0.2s;
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: #006a61;
}

.mobile-btn {
  width: 100%;
  padding: 14px 0;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
  text-align: left;
  cursor: pointer;
  transition: opacity 0.2s;
}

.mobile-btn:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .navbar-container {
    padding: 0 1px;
  }

  .nav-actions {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}
</style>
