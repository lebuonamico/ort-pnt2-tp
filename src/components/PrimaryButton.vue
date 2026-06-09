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
  background: #006a61;
  color: white;
}

.primary:hover:not(:disabled) {
  background: #00554d;
}

.dark {
  background: #0f172a;
  color: white;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
}

.dark:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-1px);
}

.outline {
  background: transparent;
  border: 1px solid #c6c6cd;
  color: #0f172a;
}

.outline:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.03);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>