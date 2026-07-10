<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAuthForm } from '../composables/useAuthForm.js'
import PrimaryButton from '../components/PrimaryButton.vue'
import AuthInputGroup from '../components/AuthInputGroup.vue'

const router = useRouter()
const authStore = useAuthStore()
const { email, password, submit, isLogin, errorMessage } = useAuthForm()

onMounted(() => {
  isLogin.value = true
})

const handleToggle = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">

    <div class="login-container">

      <div class="login-card">

        <h1 class="card-title">
          Bienvenido de nuevo
        </h1>

        <p class="card-subtitle">
          Ingresa tus credenciales para acceder a tu panel.
        </p>

        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submit" class="form">

          <AuthInputGroup label="Correo Electrónico" icon="mail" id="email" type="email"
            placeholder="ejemplo@finanzaspro.com" v-model="email" :disabled="authStore.loading" />

          <div class="field-group">
            <div class="password-header">
              <label for="password" class="field-label">
                Contraseña
              </label>
            </div>

            <AuthInputGroup label="" icon="lock" id="password" type="password" placeholder="••••••••" v-model="password"
              :disabled="authStore.loading" :showToggle="true" />
          </div>

          <PrimaryButton type="submit" :disabled="authStore.loading">
            {{ authStore.loading ? 'Cargando...' : 'Iniciar Sesión' }}
          </PrimaryButton>

        </form>

        <div class="divider">
          <span></span>
        </div>

      </div>

      <p class="footer-text">
        ¿No tienes una cuenta?

        <button @click="handleToggle" class="register-link">
          Regístrate gratis
        </button>
      </p>

      <div class="bg-top"></div>
      <div class="bg-bottom"></div>

    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');

* {
  box-sizing: border-box;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.login-page {
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  background: var(--color-bg-page);
}

.login-container {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.brand {
  margin-bottom: 40px;
  text-align: center;
}



.brand-icon {
  font-size: 40px;
  color: var(--color-accent);
  display: flex;
  align-items: center;
}

.brand-title {
  font-family: 'Manrope', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
  text-decoration: none;
}

.login-card {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 48px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-title {
  font-family: 'Manrope', sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.card-subtitle {
  font-family: 'Work Sans', sans-serif;
  font-size: 18px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 20px;
}

.input {
  width: 100%;
  height: 52px;
  padding-left: 40px;
  padding-right: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface-2);
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-soft);
}

.password-input {
  padding-right: 48px;
}

.visibility-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.visibility-icon {
  font-size: 20px;
}



.checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent);
}


.divider {
  margin: 32px 0;
  position: relative;
}

.divider span {
  width: 100%;
  height: 1px;
  background: var(--color-border);
  display: block;
}

.footer-text {
  margin-top: 32px;
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  color: var(--color-text-secondary);
  text-align: center;
}

.register-link {
  background: transparent;
  border: none;
  color: var(--color-accent);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.register-link:hover {
  text-decoration: underline;
}

.error-box {
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
}

.bg-top {
  position: fixed;
  top: 0;
  right: 0;
  width: 33%;
  height: 50%;
  opacity: 0.2;
  background: linear-gradient(to bottom left, #86f2e4, transparent);
  filter: blur(80px);
  z-index: -1;
}

.bg-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 33%;
  height: 50%;
  opacity: 0.2;
  background: linear-gradient(to top right, #dce9ff, transparent);
  filter: blur(80px);
  z-index: -1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo:visited {
  color: inherit;
}

.logo:hover {
  text-decoration: none;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .brand-title {
    font-size: 28px;
  }

  .card-title {
    font-size: 22px;
  }
}
</style>
