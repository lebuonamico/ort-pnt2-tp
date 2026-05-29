<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAuthForm } from '../composables/useAuthForm.js'

import PrimaryButton from '../components/PrimaryButton.vue'
import AuthInputGroup from '../components/AuthInputGroup.vue'

const router = useRouter()
const authStore = useAuthStore()
const { email, password, confirmPassword, fullName, terms, submit, isLogin, errorMessage } = useAuthForm()

onMounted(() => {
  isLogin.value = false
})

const handleRegister = () => {
  submit()
}

const handleToggle = () => {
  router.push('/login')
}
</script>

<template>
  <div class="page-wrapper">
    <main class="register-container">
      <!-- LEFT SIDE -->
      <section class="branding-section">
        <div class="logo">
          <span class="material-symbols-outlined">
            account_balance
          </span>

          <h2>Finanzas Pro</h2>
        </div>

        <div class="branding-content">
          <div>
            <h1>
              Toma el control total de tu patrimonio.
            </h1>

            <p>
              Únete a la plataforma de gestión financiera preferida por
              profesionales. Datos en tiempo real, análisis profundo
              y seguridad bancaria.
            </p>
          </div>

          <div class="features">
            <div class="feature-card">
              <span class="material-symbols-outlined">
                security
              </span>

              <small>SEGURIDAD</small>

              <h3>Encriptación AES-256</h3>
            </div>

            <div class="feature-card">
              <span class="material-symbols-outlined">
                monitoring
              </span>

              <small>ANÁLISIS</small>

              <h3>IA Predictiva</h3>
            </div>
          </div>
        </div>

        <div class="users">
          <div class="avatars">
            <img
              src="https://i.pravatar.cc/100?img=1"
              alt="user"
            />

            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="user"
            />
          </div>

          <p>
            +5,000 profesionales ya gestionan sus activos con nosotros.
          </p>
        </div>
      </section>

      <!-- RIGHT SIDE -->
      <section class="form-section">
        <div class="form-container">
          <header>
            <h1>Crear una cuenta</h1>

            <p>
              Comienza tu viaje hacia la libertad financiera hoy mismo.
            </p>
          </header>

          <form @submit.prevent="handleRegister">
            <div
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </div>

            <AuthInputGroup
              label="Nombre completo"
              icon="person"
              id="name"
              type="text"
              placeholder="Ej: Juan Pérez"
              v-model="fullName"
              :disabled="authStore.loading"
            />

            <AuthInputGroup
              label="Correo electrónico"
              icon="mail"
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
              v-model="email"
            />

            <AuthInputGroup
              label="Contraseña"
              icon="lock"
              id="password"
              type="password"
              placeholder="••••••••"
              v-model="password"
              :disabled="authStore.loading"
              :showToggle="true"
            />

            <AuthInputGroup
              label="Confirmar contraseña"
              icon="lock_reset"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              v-model="confirmPassword"
              :disabled="authStore.loading"
              :showToggle="true"
            />

            <div class="terms">
              <input
                v-model="terms"
                type="checkbox"
                id="terms"
              />

              <label for="terms">
                Acepto los
                <a href="#">Términos de Servicio</a>
                y la
                <a href="#">Política de Privacidad</a>.
              </label>
            </div>

            <PrimaryButton
              type="submit"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Cargando...' : 'Registrarse' }}
            </PrimaryButton>
          </form>

          <footer>
            <p>
              ¿Ya tengo una cuenta?

              <a
                href="#"
                @click.prevent="handleToggle"
              >
                Iniciar sesión
              </a>
            </p>
          </footer>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f8f9ff;
  overflow: visible;
}

.register-container {
  width: min(96vw, 1600px);
  display: grid;
  grid-template-columns: 1fr 1fr;

  background: white;

  border-radius: 24px;
  overflow: visible;

  border: 1px solid rgba(198, 198, 205, 0.3);

  box-shadow: 12px 12px 12px rgba(15, 23, 42, 0.05);
}

/* LEFT */

.branding-section {
  background: #131b2e;
  color: white;

  padding: 48px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h2 {
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 700;
}

.logo span {
  font-size: 32px;
  color: #4edea3;
}

.branding-content {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.branding-content h1 {
  font-family: 'Manrope', sans-serif;

  font-size: clamp(28px, 4.8vw, 56px);
  line-height: 1.05;
  letter-spacing: -1px;

  margin-bottom: 28px;
}

.branding-content p {
  color: #94a3b8;

  font-size: 22px;
  line-height: 1.7;

  max-width: 580px;
}

/* FEATURES */

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 20px;

  padding: 28px;
}

.feature-card span {
  color: #4edea3;

  margin-bottom: 18px;

  display: block;
}

.feature-card small {
  display: block;

  margin-bottom: 10px;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;

  opacity: 0.7;
}

.feature-card h3 {
  font-family: 'Manrope', sans-serif;

  font-size: 28px;
  line-height: 1.3;
}

/* USERS */

.users {
  display: flex;
  align-items: center;
  gap: 18px;
}

.users p {
  color: rgba(255,255,255,0.9);
}

.avatars {
  display: flex;
}

.avatars img {
  width: 44px;
  height: 44px;

  border-radius: 50%;

  border: 3px solid #131b2e;

  margin-left: -10px;
}

.avatars img:first-child {
  margin-left: 0;
}

/* RIGHT */

.form-section {
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 48px;
}

.form-container {
  width: 100%;
  max-width: 460px;
}

.form-container header {
  margin-bottom: 42px;
}

.form-container h1 {
  font-family: 'Manrope', sans-serif;

  font-size: 52px;
  line-height: 1.1;

  color: #0f172a;

  margin-bottom: 14px;
}

.form-container header p {
  color: #64748b;

  font-size: 18px;
  line-height: 1.6;
}

form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  font-size: 14px;
  line-height: 1.6;

  color: #64748b;
}

.terms input[type='checkbox'] {
  width: 16px;
  height: 16px;

  margin-top: 3px;

  accent-color: #006a61;

  cursor: pointer;
}

.terms a {
  color: #006a61;
  font-weight: 600;
  text-decoration: none;
}

.error-message {
  background: #fee2e2;

  border: 1px solid #fca5a5;

  color: #991b1b;

  border-radius: 14px;

  padding: 14px 16px;

  font-size: 14px;
  line-height: 1.5;
}

footer {
  margin-top: 34px;

  text-align: center;
}

footer p {
  color: #64748b;
}

footer a {
  color: #006a61;

  font-weight: 700;

  text-decoration: none;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .branding-section {
    display: none;
  }

  .form-section {
    padding: 40px;
  }

  .form-container h1 {
    font-size: 40px;
  }
}

@media (max-width: 640px) {
  .page-wrapper {
    padding: 0;
  }

  .register-container {
    min-height: 100%;
    border-radius: 0;
  }

  .form-section {
    padding: 24px;
  }

  .form-container h1 {
    font-size: 34px;
  }
}
</style>
