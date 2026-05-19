import { reactive } from 'vue'
import { useAuth } from './useAuth.js'
import { useRouter } from 'vue-router'

export const useAuthForm = () => {

    const router = useRouter()

    const { signIn, signUp } = useAuth()


    const form = reactive({
        //name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
        isLogin: true,
        loading: false,
        error: ''
    })


    const validateForm = () => {
        if (form.email === '' || form.password === '') {
            form.error = 'Email y contraseña son obligatorios'
            return false
        }

        if (!form.isLogin) {
           /* if (form.name === '') {
                form.error = 'El nombre es obligatorio'
                return false
            }*/

            if (form.password !== form.confirmPassword) {
                form.error = 'Las contraseñas deben coincidir'
                return false
            }

            if (!form.terms) {
                form.error = 'Debes aceptar los términos de servicio'
                return false
            }
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