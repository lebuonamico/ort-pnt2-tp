<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <RouterLink to="/" class="logo">Finanzas Pro</RouterLink>

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          <button @click="handleLogout" class="nav-cta">Cerrar sesión</button>
        </template>

        <template v-else>
          <button @click="handleLogin" class="nav-link">Login</button>
          <button @click="handleRegister" class="nav-cta">Registrarse</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = () => router.push('/login')
const handleRegister = () => router.push('/register')
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(198, 198, 205, 0.35);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  z-index: 1000;
}

.navbar-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link,
.nav-cta {
  border: none;
  cursor: pointer;
  font-family: 'Work Sans', sans-serif;
  font-size: 15px;
  transition: all 0.2s ease;
}

.nav-link {
  background: transparent;
  color: #45464d;
}

.nav-link:hover {
  color: #0f172a;
}

.nav-cta {
  background: #006a61;
  color: #fff;
  padding: 12px 24px;
  border-radius: 999px;
}

.nav-cta:hover {
  background: #00584f;
}

@media (max-width: 640px) {
  .navbar {
    height: auto;
    padding: 12px 0;
  }

  .navbar-container {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
