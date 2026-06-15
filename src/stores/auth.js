import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useErrorTranslator } from '../composables/useErrorTranslator'

export const useAuthStore = defineStore('auth', () => {

  const { translateError } = useErrorTranslator()
  const user = ref(null)
  const role = ref('user')
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email ?? '')
  const userName = computed(() => {
    if (user.value?.user_metadata?.full_name) return user.value.user_metadata.full_name
    if (user.value?.email) {
      const prefix = user.value.email.split('@')[0]
      return prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }
    return 'usuario'
  })
  const isAdmin = computed(() => role.value === 'admin')

  async function loadUserRole(sessionUser) {
    if (!sessionUser) {
      role.value = 'user'
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', sessionUser.id)
      .maybeSingle()

    if (error) {
      console.error('No se pudo cargar el rol del usuario:', error.message)
      role.value = 'user'
      return
    }

    role.value = data?.role ?? 'user'
  }

  async function syncProfileEmail(sessionUser) {
    if (!sessionUser?.id || !sessionUser?.email) return

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        { id: sessionUser.id, email: sessionUser.email },
        { onConflict: 'id' }
      )

    if (upsertError) {
      console.error('No se pudo guardar el email del perfil:', upsertError.message)
    }
  }

  async function setUser(sessionUser, { forzar = false } = {}) {
    const mismoUsuario = sessionUser?.id && sessionUser.id === user.value?.id
    user.value = sessionUser

    if (mismoUsuario && !forzar) return

    if (sessionUser) await syncProfileEmail(sessionUser)
    await loadUserRole(sessionUser)
  }

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', result.data.user.id)
        .maybeSingle()

      if (profile?.status === 'suspended') {
        await supabase.auth.signOut()
        const message = 'Tu cuenta está suspendida. Contactá a un administrador.'
        error.value = message
        return {
          success: false,
          error: { message }
        }
      }

      await setUser(result.data.user)
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
      await setUser(result.data.user)
    }

    return result
  }

  async function logout() {
    await supabase.auth.signOut()
    await setUser(null)
  }

  async function initAuthListener() {

    if (initialized.value) return

    const { data: { session } } = await supabase.auth.getSession()
    await setUser(session?.user ?? null, { forzar: true })
    initialized.value = true

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return
      setTimeout(() => {
        setUser(session?.user ?? null)
      }, 0)
    })
  }

  return {
    user,
    role,
    loading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
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
    pick:['user', 'role']
  }
})
