export function useErrorTranslator() {

    const errors = {
        'User already registered': 'El usuario ya está registrado',
        'Invalid login credentials': 'Correo o contraseña incorrectos',
        'Password should be at least 6 characters.':
            'La contraseña debe tener al menos 6 caracteres'
    }

    const translateError = (message) => {
        return errors[message] || 'Ocurrió un error'
    }

    return { translateError }
}