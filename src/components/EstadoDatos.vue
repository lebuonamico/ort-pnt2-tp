<script setup>
defineProps({
  cargando: { type: Boolean, default: false },
  error: { type: [String, Object], default: null },
})
</script>

<template>
  <div v-if="cargando" class="estado-datos">
    <span class="spinner" role="status" aria-label="Cargando"></span>
    <p>Cargando datos...</p>
  </div>

  <div v-else-if="error" class="estado-datos estado-error">
    <span class="material-symbols-outlined">error</span>
    <p>No se pudieron cargar los datos.</p>
  </div>

  <slot v-else />
</template>

<style scoped>
.estado-datos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  height: 100%;
  min-height: 240px;
  padding: 32px;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 14px;
}

.estado-datos p {
  margin: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  animation: spin 0.7s linear infinite;
}

.estado-error .material-symbols-outlined {
  font-size: 36px;
  color: var(--color-danger);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
