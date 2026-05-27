import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue")
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/DashboardView.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("../views/NotFoundView.vue")
    }
]


const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    await authStore.initAuthListener()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirigir al login, opcionalmente con un mensaje
        next({ name: 'login', query: { redirect: to.fullPath } })
    }
    else if((to.name === 'login' && authStore.isAuthenticated) || (to.name === 'register' && authStore.isAuthenticated)) {
        console.log('Usuario ya autenticado, redirigiendo al dashboard')
        // Si el usuario ya está autenticado, redirigir al dashboard
        next({ name: 'dashboard' })
    }
    else {
        next()
    }
})

export default router
