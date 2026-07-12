<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },

  disabled: {
    type: Boolean,
    default: false
  },

  variant: {
    type: String,
    default: 'primary'
  },

  fullWidth: {
    type: Boolean,
    default: true
  }
})

const buttonClass = computed(() => {
  return [
    'primary-button',
    props.variant,
    {
      'full-width': props.fullWidth
    }
  ]
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>

<style scoped>
.primary-button {
  height: 52px;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.full-width {
  width: 100%;
}

.primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.dark {
  background: var(--color-text-primary);
  color: var(--color-surface);
  box-shadow: var(--shadow-card-hover);
}

.dark:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.outline:hover:not(:disabled) {
  background: var(--color-accent-soft);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>