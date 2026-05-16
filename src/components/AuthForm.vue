<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthForm } from '../composables/useAuthForm.js'

const props = defineProps({
  mode: {
    type: String,
    default: 'login'
  }
})

const router = useRouter()
const { form, submit, toggleMode } = useAuthForm()

onMounted(() => {
  form.isLogin = props.mode === 'login'
})

const handleToggle = () => {
  // If the view provided a mode prop, navigate to the counterpart route
  if (props.mode === 'login') return router.push('/register')
  if (props.mode === 'register') return router.push('/login')

  // otherwise fall back to local toggle
  toggleMode()
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card glass-card">
      <div class="auth-header">
        <div class="icon-wrapper"></div>
        <h2>{{ form.isLogin ? 'Bienvenido' : 'Crea tu cuenta' }}</h2>
        <p class="subtitle">
          {{ form.isLogin ? 'Ingresa tus credenciales' : 'Regístrate para comenzar' }}
        </p>
      </div>
      
      <div v-if="form.error" class="error-message">
        {{ form.error }}
      </div>
      
      <form @submit.prevent="submit">
        <div class="field">
          <label>Email</label>
          <input 
            type="email" 
            v-model="form.email"
            placeholder="dev@example.com" 
            :disabled="form.loading"
          >
        </div>
        
        <div class="field">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password"
            placeholder="••••••••" 
            :disabled="form.loading"
          >
        </div>
        
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="form.loading"
        >
          {{ form.loading ? 'Cargando...' : (form.isLogin ? 'Entrar' : 'Registrarme') }}
        </button>
        
        <a 
          href="#" 
          @click.prevent="handleToggle" 
          class="toggle-link"
        >
          {{ form.isLogin ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta' }}
        </a>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '../style.css';
</style>
