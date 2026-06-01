import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue"),
        meta: { requiresAuth: false, hideNavbar: false }
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/DashboardView.vue"),
        meta: { requiresAuth: true, hideNavbar: false }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
        meta: { requiresAuth: false, hideNavbar: false }
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue"),
        meta: { requiresAuth: false, hideNavbar: false }
    },
    {
        path: "/privacidad",
        name: "privacy-policy",
        component: () => import("../views/PrivacyPolicyView.vue"),
        meta: { requiresAuth: false, hideNavbar: false }
    },
    {
        path: "/admin",
        component: () => import("../views/admin/AdminLayout.vue"),
        meta: { requiresAuth: true, requiresAdmin: true, hideNavbar: false },
        children: [
            {
                path: "",
                name: "admin-home",
                component: () => import("../views/admin/AdminHomeView.vue")
            },
            {
                path: "usuarios",
                name: "admin-usuarios",
                component: () => import("../views/admin/AdminUsersView.vue")
            },
            {
                path: "movimientos",
                name: "admin-movimientos",
                component: () => import("../views/admin/AdminTransactionsView.vue")
            },
            {
                path: "categorias",
                name: "admin-categorias",
                component: () => import("../views/admin/AdminCategoriesView.vue")
            }
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("../views/NotFoundView.vue"),
        meta: { requiresAuth: false, hideNavbar: false }
    }
]


const router = createRouter(
    {
        history: createWebHistory(),
        routes,
        scrollBehavior() {
            return { top: 0 }
        }
    }
)

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    await authStore.initAuthListener()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirigir al login
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return { name: 'dashboard' }
    }
    else if ((to.name === 'login' && authStore.isAuthenticated) || (to.name === 'register' && authStore.isAuthenticated)) {
        console.log('Usuario ya autenticado, redirigiendo al dashboard')
        // Si el usuario ya está autenticado, redirigir al dashboard
        return { name: 'dashboard' }
    }
})

export default router
