import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuthForm() {
    const authStore = useAuthStore()
    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const fullName = ref('')
    const terms = ref(false)
    const isLogin = ref(true)
    const errorMessage = ref('')

    function validateForm() {

        if (!email.value || !password.value) {
            errorMessage.value = 'Email y contraseña obligatorios'
            return false
        }

        if (!isLogin.value) {

            if (!fullName.value.trim()) {
                errorMessage.value = 'Nombre completo obligatorio'
                return false
            }

            if (password.value !== confirmPassword.value) {
                errorMessage.value = 'Las contraseñas no coinciden'
                return false
            }

            if (!terms.value) {
                errorMessage.value = 'Debes aceptar los términos'
                return false
            }
        }

        return true
    }

    async function submit() {

        errorMessage.value = ''

        if (!validateForm()) return

        const result = isLogin.value
            ? await authStore.login(email.value, password.value)
            : await authStore.register(email.value, password.value, {
                full_name: fullName.value.trim()
            })

        if (result.success) {
            router.push({ name: 'dashboard' })
        } else {
            errorMessage.value = result.error.message
        }
    }

    return {
        email,
        password,
        confirmPassword,
        fullName,
        terms,
        isLogin,
        errorMessage,
        submit
    }
}
