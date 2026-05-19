<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :type="props.type" class="primary-button" :disabled="props.disabled">
    <slot />
  </button>
</template>

<style scoped>
.primary-button {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  background: #006a61;
  color: white;
  font-family: inherit;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-button:hover:not(:disabled) {
  background: #00554d;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
