<script setup>
defineProps({
  titulo: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  icono: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="card">

    <!-- Header de la card -->
    <div class="card-header">
      <span class="titulo">{{ titulo }}</span>
      <span class="icono">{{ icono }}</span>
    </div>

    <!-- Monto -->
    <p class="monto">${{ monto }}</p>

    <!-- Contenido personalizado -->
    <slot />

  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.icono {
  font-size: 24px;
}

.monto {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }

  .monto {
    font-size: 22px;
  }
}
</style>