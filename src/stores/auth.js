import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useErrorTranslator } from '../composables/useErrorTranslator'

export const useAuthStore = defineStore('auth', () => {

  const { translateError } = useErrorTranslator()

  // STATE
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // GETTERS
  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email ?? '')
  const userName = computed(() =>
    user.value?.user_metadata?.full_name ||
    user.value?.email ||
    'usuario'
  )

  // Función reutilizable
  async function executeAuth(action) {

    loading.value = true
    error.value = null

    const { data, error: err } = await action()

    loading.value = false

    if (err) {

      const translated = translateError(err.message)

      error.value = translated

      return {
        success: false,
        error: {
          message: translated
        }
      }
    }

    return {
      success: true,
      data
    }
  }

  async function login(email, password) {

    const result = await executeAuth(() =>
      supabase.auth.signInWithPassword({
        email,
        password
      })
    )

    if (result.success) {
      user.value = result.data.user
    }

    return result
  }

  async function register(email, password, metadata = {}) {

    const result = await executeAuth(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
    )

    if (
      result.success &&
      result.data.user &&
      result.data.session
    ) {
      user.value = result.data.user
    }

    return result
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  async function initAuthListener() {

    if (initialized.value) return

    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    initialized.value = true

    supabase.auth
      .onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
  }

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    userEmail,
    userName,
    login,
    register,
    logout,
    initAuthListener
  }

},{
  persist:{
    key:'auth-store',
    storage:localStorage,
    pick:['user']
  }
})
