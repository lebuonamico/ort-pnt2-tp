import { reactive } from 'vue'
import { useAuth } from './useAuth.js'
import { useRouter } from 'vue-router'

export const useAuthForm = () => {

    const router = useRouter()

    const { signIn, signUp } = useAuth()


    const form = reactive({
        email: '',
        password: '',
        isLogin: true,
        loading: false,
        error: ''
    })


    const validateForm = () => {
        if (form.email === '' || form.password === '') {
            form.error = 'Email y contraseña son obligatorios'
            return false
        }
        return true
    }


    const login = async () => {
        await signIn({ email: form.email, password: form.password })
        router.push('/dashboard')
    }

    const register = async () => {
        await signUp({ email: form.email, password: form.password })
        router.push('/dashboard')
    }



    const submit = async () => {
        form.loading = true
        form.error = ''

        if (!validateForm()) {
            form.loading = false
            return
        }

        try {
            if (form.isLogin) {
                await login()
            } else {
                await register()
            }
        } catch (error) {
            form.error = error?.message || 'Error en la autenticación'
        } finally {
            form.loading = false
        }
    }


    const toggleMode = () => {
        form.isLogin = !form.isLogin
        form.error = ''
    }

    return {
        form, submit, toggleMode
    }
}