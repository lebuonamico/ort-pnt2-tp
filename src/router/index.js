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
        path: "/movimientos",
        name: "movimientos",
        component: () => import("../views/MovimientosView.vue"),
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
    }
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    }
    else if((to.name === 'login' && authStore.isAuthenticated) || (to.name === 'register' && authStore.isAuthenticated)) {
        next({ name: 'dashboard' })
    }
    else {
        next()
    }
})

export default router