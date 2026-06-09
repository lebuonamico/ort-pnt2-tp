import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue"),
        meta: { requiresAuth: false, hideNavbar: false, hideSidebar: true }
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/DashboardView.vue"),
        meta: { requiresAuth: true, hideNavbar: true, hideSidebar: false }
    },
    {
        path: "/estadisticas",
        name: "estadisticas",
        component: () => import("../views/EstadisticasView.vue"),
         meta: { requiresAuth: true, hideNavbar: true, hideSidebar: false }
    },
    {
        path: "/movimientos",
        name: "movimientos",
        component: () => import("../views/MovimientosView.vue"),
        meta: { requiresAuth: true, hideNavbar: true, hideSidebar: false }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
        meta: { requiresAuth: false, hideNavbar: false, hideSidebar: true }
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/RegisterView.vue"),
        meta: { requiresAuth: false, hideNavbar: false, hideSidebar: true }
    },
    {
        path: "/privacidad",
        name: "privacy-policy",
        component: () => import("../views/PrivacyPolicyView.vue"),
        meta: { requiresAuth: false, hideNavbar: false, hideSidebar: true }
    },
    {
        path: '/terminos',
        name: 'terms',
        component: () => import('../views/TermsView.vue'),
        meta: { requiresAuth: false, hideNavbar: false, hideSidebar: true }
    },
    {
        path: "/admin",
        component: () => import("../views/admin/AdminLayout.vue"),
        meta: { requiresAuth: true, requiresAdmin: true, hideNavbar: true, hideSidebar: false },
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
        meta: { requiresAuth: false, hideNavbar: true, hideSidebar: true }
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
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return { name: 'dashboard' }
    }
    else if ((to.name === 'login' && authStore.isAuthenticated) || (to.name === 'register' && authStore.isAuthenticated)) {
        return { name: 'dashboard' }
    }
})

export default router