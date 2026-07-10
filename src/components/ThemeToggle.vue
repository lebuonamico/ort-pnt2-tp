<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { tema, toggleTema } = useTheme()

const etiqueta = computed(() =>
  tema.value === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'
)
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="etiqueta"
    :title="etiqueta"
    @click="toggleTema"
  >
    <svg class="theme-toggle-icon" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id="tt-squircle">
          <rect x="0" y="0" width="40" height="40" rx="13" />
        </clipPath>
        <!-- Máscara para la Luna: círculo lleno menos otro desplazado = creciente -->
        <mask id="tt-moon">
          <circle cx="27.5" cy="27.5" r="6.2" fill="#fff" />
          <circle cx="30.8" cy="24.2" r="6.2" fill="#000" />
        </mask>
      </defs>

      <g clip-path="url(#tt-squircle)">
        <!-- Mitad blanca (fondo de la Luna) -->
        <rect x="0" y="0" width="40" height="40" fill="#ffffff" />
        <!-- Mitad negra (fondo del Sol), triángulo superior-izquierdo -->
        <polygon points="0,0 40,0 0,40" fill="#0d0d0f" />

        <!-- Sol (blanco) sobre la mitad negra -->
        <g stroke="#ffffff" stroke-width="1.5" stroke-linecap="round">
          <circle cx="12.5" cy="12.5" r="4" fill="#ffffff" stroke="none" />
          <line x1="12.5" y1="3.6" x2="12.5" y2="6" />
          <line x1="12.5" y1="19" x2="12.5" y2="21.4" />
          <line x1="3.6" y1="12.5" x2="6" y2="12.5" />
          <line x1="19" y1="12.5" x2="21.4" y2="12.5" />
          <line x1="6.4" y1="6.4" x2="8.1" y2="8.1" />
          <line x1="16.9" y1="16.9" x2="18.6" y2="18.6" />
          <line x1="6.4" y1="18.6" x2="8.1" y2="16.9" />
          <line x1="16.9" y1="8.1" x2="18.6" y2="6.4" />
        </g>

        <!-- Luna (negra, creciente) sobre la mitad blanca -->
        <rect x="0" y="0" width="40" height="40" fill="#0d0d0f" mask="url(#tt-moon)" />
      </g>

      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="12.4" fill="none"
            stroke="var(--color-border)" stroke-width="1.2" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 13px;
  background: transparent;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  line-height: 0;
}

.theme-toggle:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-hover);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.theme-toggle-icon {
  width: 32px;
  height: 32px;
  display: block;
}
</style>
