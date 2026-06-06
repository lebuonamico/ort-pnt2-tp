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

    <!-- Login Container -->
    <div class="login-container">

      <!-- Card -->
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

        <!-- Divider -->
        <div class="divider">
          <span></span>
        </div>

      </div>

      <!-- Footer -->
      <p class="footer-text">
        ¿No tienes una cuenta?

        <button @click="handleToggle" class="register-link">
          Regístrate gratis
        </button>
      </p>

      <!-- Background -->
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
  background: #f8f9ff;
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
  color: #006a61;
  display: flex;
  align-items: center;
}

.brand-title {
  font-family: 'Manrope', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #0b1c30;
  letter-spacing: -0.5px;
  text-decoration: none;
}

.login-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #c6c6cd;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0px 4px 20px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.card-title {
  font-family: 'Manrope', sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: #0b1c30;
  margin-bottom: 8px;
}

.card-subtitle {
  font-family: 'Work Sans', sans-serif;
  font-size: 18px;
  color: #45464d;
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
  color: #45464d;
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
  color: #006a61;
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
  color: #76777d;
  font-size: 20px;
}

.input {
  width: 100%;
  height: 52px;
  padding-left: 40px;
  padding-right: 16px;
  border: 1px solid #c6c6cd;
  border-radius: 8px;
  background: #f8f9ff;
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  color: #0b1c30;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #006a61;
  box-shadow: 0 0 0 2px rgba(0, 106, 97, 0.1);
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
  color: #76777d;
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
  accent-color: #006a61;
}


.divider {
  margin: 32px 0;
  position: relative;
}

.divider span {
  width: 100%;
  height: 1px;
  background: #c6c6cd;
  display: block;
}

.footer-text {
  margin-top: 32px;
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  color: #45464d;
  text-align: center;
}

.register-link {
  background: transparent;
  border: none;
  color: #006a61;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.register-link:hover {
  text-decoration: underline;
}

.error-box {
  background: #ffdad6;
  border: 1px solid #ba1a1a;
  color: #93000a;
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
