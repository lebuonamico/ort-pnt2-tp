<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const actions = computed(() => {

  if (authStore.isAuthenticated) {
    return [
      {
        label: 'Dashboard',
        type: 'link',
        to: '/dashboard',
        class: route.name === 'dashboard'
          ? 'nav-cta'
          : 'nav-link'
      },
      {
        label: 'Cerrar sesión',
        type: 'button',
        class: 'nav-link',
        action: async () => {
          await authStore.logout()
          router.push('/login')
        }
      }
    ]
  }

  return [
    {
      label: 'Ingresar',
      type: 'button',
      class: route.name === 'login'
        ? 'nav-cta'
        : 'nav-link',
      action: () => router.push('/login')
    },
    {
      label: 'Registrarse',
      type: 'button',
      class: route.name === 'register'
        ? 'nav-cta'
        : 'nav-link',
      action: () => router.push('/register')
    }
  ]
})
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-container">

      <RouterLink
        to="/"
        class="logo"
      >
        Finanzas Pro
      </RouterLink>

      <div class="nav-actions">

        <component
          v-for="item in actions"
          :key="item.label"
          :is="item.type === 'link' ? RouterLink : 'button'"
          :to="item.to"
          :class="item.class"
          @click="item.action"
        >
          {{ item.label }}
        </component>

      </div>

    </div>
  </nav>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;

  background: rgba(248,249,255,.78);

  backdrop-filter: blur(18px);

  border-bottom: 1px solid rgba(198,198,205,.18);

  z-index:1000;
}

.navbar-container {

  width:min(1200px,100%);
  max-width:1200px;

  margin:0 auto;

  padding:0 24px;

  height:100%;

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:24px;
}


.logo {

  font-family:'Manrope',sans-serif;

  font-size:28px;

  font-weight:800;

  color:#0f172a;

  text-decoration:none;

  transition:.25s;
}

.logo:hover{

  transform:translateY(-1px);

  opacity:.8;
}


.nav-actions {

  display:flex;

  align-items:center;

  gap:16px;
}


.nav-link,
.nav-cta {

  border:none;

  cursor:pointer;

  font-family:'Work Sans',sans-serif;

  font-size:15px;

  font-weight:600;

  padding:12px 24px;

  border-radius:999px;

  transition:
    all .25s ease;
}


.nav-link {

  background:transparent;

  color:#45464d;
}

.nav-link:hover {

  background:rgba(0,106,97,.08);

  color:#006a61;
}


.nav-cta {

  background:#006a61;

  color:white;

  box-shadow:
    0 6px 18px rgba(0,106,97,.22);
}

.nav-cta:hover {

  background:#00584f;

  transform:translateY(-2px);

  box-shadow:
    0 12px 28px rgba(0,106,97,.28);
}


@media (max-width:640px){

.navbar{
height:auto;
padding:12px;
}

.navbar-container{

width:100%;

padding:0;

flex-direction:column;

gap:12px;
}

.logo{

width:100%;

text-align:center;
}

.nav-actions{

width:100%;

flex-direction:column;

align-items:center;

justify-content:center;

gap:12px;
}

.nav-actions>*{

width:100%;
max-width:280px;
}

.nav-link,
.nav-cta{

width:100%;
}

}

</style>