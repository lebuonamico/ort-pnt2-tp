<script setup>
import { RouterLink, RouterView } from 'vue-router'

const tabs = [
  { label: 'Panel Principal', to: { name: 'admin-home' }, icon: 'dashboard' },
  { label: 'Usuarios', to: { name: 'admin-usuarios' }, icon: 'group' },
  { label: 'Movimientos', to: { name: 'admin-movimientos' }, icon: 'receipt_long' },
  { label: 'Categorías', to: { name: 'admin-categorias' }, icon: 'category' }
]
</script>

<template>
  <div class="admin-layout">

    <header class="admin-header">
      <div class="admin-header-inner">
        <div>
          <p class="admin-eyebrow">Finanzas Pro</p>
          <h1 class="admin-title">Panel de Administración</h1>
          <p class="admin-subtitle">
            Gestiona usuarios, movimientos y categorías globales de la plataforma.
          </p>
        </div>
      </div>
    </header>

    <nav class="admin-tabs">
      <div class="admin-tabs-inner">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.label"
          :to="tab.to"
          class="admin-tab"
          active-class=""
          exact-active-class="admin-tab-active"
        >
          <span class="material-symbols-outlined admin-tab-icon">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="admin-content">
      <RouterView />
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.admin-layout {
  width: 100%;
  min-height: calc(100vh - var(--navbar-height));
  background: #f8f9ff;
  padding-bottom: 64px;
}

.admin-header {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
  border-bottom: 1px solid rgba(198, 198, 205, 0.4);
}

.admin-header-inner {
  width: min(1200px, 100%);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 40px 24px 24px;
}

.admin-eyebrow {
  margin: 0 0 6px;
  font-family: 'Work Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #006a61;
}

.admin-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #0b1c30;
  line-height: 1.2;
}

.admin-subtitle {
  margin: 8px 0 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 15px;
  color: #45464d;
  max-width: 640px;
}

.admin-tabs {
  border-bottom: 1px solid rgba(198, 198, 205, 0.4);
  background: #f8f9ff;
}

.admin-tabs-inner {
  width: min(1200px, 100%);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.admin-tabs-inner::-webkit-scrollbar { display: none; }

.admin-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 6px;
  margin: 0 10px;
  text-decoration: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #45464d;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.admin-tab:first-child { margin-left: 0; }

.admin-tab:hover { color: #006a61; }

.admin-tab-icon {
  font-size: 20px;
}

.admin-tab-active {
  color: #006a61;
  border-bottom-color: #006a61;
}

.admin-content {
  width: min(1200px, 100%);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 32px 24px;
}

@media (max-width: 640px) {
  .admin-header-inner {
    padding: 24px 16px 16px;
  }

  .admin-title {
    font-size: 24px;
  }

  .admin-tabs-inner {
    padding: 0 16px;
  }

  .admin-tab {
    padding: 12px 4px;
    font-size: 13px;
    margin: 0 8px;
  }

  .admin-tab span:not(.admin-tab-icon) {
    display: none;
  }

  .admin-content {
    padding: 20px 16px;
  }
}
</style>
