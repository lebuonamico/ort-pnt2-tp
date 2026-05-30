export function useDate() {
    const currentDate = new Date().toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return {
        currentDate
    }
}