<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PrimaryButton from './PrimaryButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const logoRoute = computed(() => 
  authStore.isAuthenticated ? '/dashboard' : '/'
)

const actions = computed(() => {

  if (authStore.isAuthenticated) {
    const items = [
      {
        label: 'Dashboard',
        type: 'link',
        to: '/dashboard'
      }
    ]

    if (authStore.isAdmin) {
      items.push({
        label: 'Admin',
        type: 'link',
        to: '/admin'
      })
    }

    items.push({
      label: 'Cerrar sesión',
      type: 'button',
      variant: 'outline',
      action: async () => {
        await authStore.logout()
        router.push('/login')
      }
    })

    return items
  }

  return [
    {
      label: 'Ingresar',
      type: 'button',
      variant: route.name === 'login'
        ? 'primary'
        : 'outline',
      action: () => router.push('/login')
    },
      {
        label: 'Registro',
        type: 'button',
        variant: route.name === 'register'
          ? 'primary'
        : 'outline',
      action: () => router.push('/register')
    }
  ]
})
</script>

<template>
  <nav class="navbar">

    <div class="navbar-container">

      <RouterLink
        :to="logoRoute"
        class="logo"
      >
        Finanzas Pro
      </RouterLink>

      <div class="nav-actions">

        <template
          v-for="item in actions"
          :key="item.label"
        >

          <RouterLink
            v-if="item.type === 'link'"
            :to="item.to"
            class="dashboard-link"
          >
            {{ item.label }}
          </RouterLink>

          <PrimaryButton
            v-else
            :variant="item.variant"
            :fullWidth="false"
            @click="item.action"
          >
            {{ item.label }}
          </PrimaryButton>

        </template>

      </div>

    </div>

  </nav>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  z-index: 1000;
  background:rgba(248,249,255,.78);
  backdrop-filter:blur(18px);
border-bottom:1px solid rgba(198,198,205,.18);}

.navbar-container{
  width:min(1200px,100%);
  max-width:1200px;
  box-sizing:border-box;

  margin:auto;

  padding:0 24px;

  height:100%;

  display:flex;
  align-items:center;
  justify-content:space-between;
}

.logo{

  text-decoration:none;

  font-family:'Manrope',sans-serif;

  font-size:28px;

  font-weight:800;

  color:#0f172a;

  transition:.2s;
}

.logo:hover{
  opacity:.8;
}

.nav-actions{
  display:flex;
  align-items:center;
  gap:16px;
}

.dashboard-link{

  text-decoration:none;

  font-family:'Work Sans',sans-serif;

  font-weight:600;

  color:#45464d;

  position:relative;

  transition:.2s;
}

.dashboard-link:hover{
  color:#006a61;
}

.router-link-active{
  color:#006a61;
}

.router-link-active::after{

  content:'';

  position:absolute;

  left:0;
  bottom:-8px;

  width:100%;
  height:2px;

  background:#006a61;

  border-radius:999px;
}

@media(max-width:640px){

.navbar{
  height:var(--navbar-height);
  padding:0;
}

.navbar-container{
padding:0 16px;
flex-direction:row;
gap:12px;
min-width:0;
}

.logo{
font-size:19px;
white-space:nowrap;
min-width:0;
}

.nav-actions{
width:auto;
flex-direction:row;
gap:6px;
flex-shrink:0;
}

.dashboard-link{
font-size:14px;
}

:deep(.primary-button){
height:40px;
padding:0 10px;
font-size:14px;
border-radius:10px;
min-width:0;
}

}

</style>
