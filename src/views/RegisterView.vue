<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthForm } from '../composables/useAuthForm.js'
import PrimaryButton from '../components/PrimaryButton.vue'
import AuthInputGroup from '../components/AuthInputGroup.vue'

const router = useRouter()
const { form, submit } = useAuthForm()

onMounted(() => {
  form.isLogin = false
})

const handleRegister = () => {
  submit()
}

const handleToggle = () => router.push('/login')
</script>

<template>
  <main class="register-container">
    <section class="branding-section">
      <div class="logo">
        <span class="material-symbols-outlined">account_balance</span>
        <h2>Finanzas Pro</h2>
      </div>

      <div class="branding-content">
        <h1>Toma el control total de tu patrimonio.</h1>

        <p>
          Únete a la plataforma de gestión financiera preferida por
          profesionales. Datos en tiempo real, análisis profundo y seguridad
          bancaria.
        </p>

        <div class="features">
          <div class="feature-card">
            <span class="material-symbols-outlined">security</span>
            <small>SEGURIDAD</small>
            <h3>Encriptación AES-256</h3>
          </div>

          <div class="feature-card">
            <span class="material-symbols-outlined">monitoring</span>
            <small>ANÁLISIS</small>
            <h3>IA Predictiva</h3>
          </div>
        </div>
      </div>

      <div class="users">
        <div class="avatars">
          <img src="https://i.pravatar.cc/100?img=1" alt="user" />
          <img src="https://i.pravatar.cc/100?img=12" alt="user" />
          <img src="https://i.pravatar.cc/100?img=32" alt="user" />
        </div>

        <p>
          +5,000 profesionales ya gestionan sus activos con nosotros.
        </p>
      </div>
    </section>

    <section class="form-section">
      <div class="form-container">
        <header>
          <h1>Crear una cuenta</h1>
          <p>
            Comienza tu viaje hacia la libertad financiera hoy mismo.
          </p>
        </header>

        <form @submit.prevent="handleRegister">
          <div v-if="form.error" class="error-message">
            {{ form.error }}
          </div>
          <!--
          <AuthInputGroup
            label="Nombre completo"
            icon="person"
            id="name"
            type="text"
            placeholder="Ej: Juan Pérez"
            v-model="form.name"
          />*/
  -->
          <AuthInputGroup label="Correo electrónico" icon="mail" id="email" type="email"
            placeholder="nombre@empresa.com" v-model="form.email" />

          <AuthInputGroup label="Contraseña" icon="lock" id="password" type="password" placeholder="••••••••"
            v-model="form.password" :disabled="form.loading" :showToggle="true" />

          <AuthInputGroup label="Confirmar contraseña" icon="lock_reset" id="confirmPassword" type="password"
            placeholder="••••••••" v-model="form.confirmPassword" :disabled="form.loading" :showToggle="true" />

          <div class="terms">
            <input v-model="form.terms" type="checkbox" id="terms" />
            <label for="terms">
              Acepto los
              <a href="#">Términos de Servicio</a>
              y la
              <a href="#">Política de Privacidad</a>.
            </label>
          </div>

          <PrimaryButton type="submit" :disabled="form.loading">
            {{ form.loading ? 'Cargando...' : 'Registrarse' }}
          </PrimaryButton>
        </form>

        <footer>
          <p>
            ¿Ya tengo una cuenta?
            <a href="#" @click.prevent="handleToggle">Iniciar sesión</a>
          </p>
        </footer>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap');

.register-container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f8f9ff;
}

.branding-section {
  background: #131b2e;
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo h2 {
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
}

.logo span {
  color: #4edea3;
  font-size: 32px;
}

.branding-content h1 {
  font-family: 'Manrope', sans-serif;
  font-size: 58px;
  line-height: 1.1;
  margin-bottom: 24px;
}

.branding-content p {
  color: #94a3b8;
  font-size: 18px;
  line-height: 1.6;
  max-width: 550px;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 50px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
}

.feature-card span {
  color: #4edea3;
  margin-bottom: 12px;
  display: block;
}

.feature-card small {
  display: block;
  margin-bottom: 8px;
  opacity: 0.7;
  font-size: 12px;
  text-transform: uppercase;
}

.feature-card h3 {
  font-size: 20px;
  margin: 0;
}

.users {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatars {
  display: flex;
}

.avatars img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #131b2e;
  margin-left: -10px;
}

.form-section {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.form-container header {
  margin-bottom: 40px;
}

.form-container h1 {
  font-family: 'Manrope', sans-serif;
  font-size: 40px;
  margin-bottom: 10px;
  color: black
}

.form-container p {
  color: #64748b;
}

form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
}

.terms a {
  color: #006a61;
  font-weight: 600;
  text-decoration: none;
}

.terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: #006a61;
  cursor: pointer;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.4;
}

footer {
  margin-top: 30px;
  text-align: center;
}

footer a {
  color: #006a61;
  font-weight: 700;
  text-decoration: none;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

@media (max-width: 1024px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .branding-section {
    display: none;
  }

  .form-section {
    padding: 30px;
  }

  .form-container h1 {
    font-size: 32px;
  }
}
</style>
