<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },

  labelAlign: {
    type: String,
    default: 'left'
  },

  icon: {
    type: String,
    default: ''
  },

  modelValue: {
    type: [String, Number],
    default: ''
  },

  id: {
    type: String,
    default: ''
  },

  type: {
    type: String,
    default: 'text'
  },

  placeholder: {
    type: String,
    default: ''
  },

  disabled: {
    type: Boolean,
    default: false
  },

  showToggle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const internalType = ref(props.type)

watch(
  () => props.type,
  (value) => {
    internalType.value = value
  }
)

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value

  internalType.value = showPassword.value
    ? 'text'
    : props.type
}

const inputClasses = computed(() => ({
  'with-icon': props.icon,
  'with-toggle': props.showToggle
}))
</script>

<template>
  <div class="input-group">

    <label
      v-if="label"
      :for="id"
      :style="{ textAlign: labelAlign }"
      class="input-label"
    >
      {{ label }}
    </label>

    <div class="input-wrapper">

      <span
        v-if="icon"
        class="material-symbols-outlined input-icon"
      >
        {{ icon }}
      </span>

      <input
        :id="id"
        :type="internalType"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput"
        :class="['input-field', inputClasses]"
      />

      <slot name="append">

        <button
          v-if="showToggle"
          type="button"
          class="toggle-password"
          @click="togglePassword"
        >
          <span class="material-symbols-outlined">
            {{
              showPassword
                ? 'visibility'
                : 'visibility_off'
            }}
          </span>
        </button>

      </slot>

    </div>
  </div>
</template>

<style scoped>
.input-group {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 10px;
}

.input-label {
  width: 100%;

  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;

  color: var(--color-text-secondary);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;

  left: 14px;
  top: 50%;

  transform: translateY(-50%);

  color: var(--color-text-muted);
  font-size: 20px;

  pointer-events: none;
}

.input-field {
  width: 100%;

  padding: 14px 16px;

  border: 2px solid transparent;
  border-radius: 14px;

  background: var(--color-surface-2);

  font-family: 'Work Sans', sans-serif;
  font-size: 16px;

  color: var(--color-text-primary);

  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  box-sizing: border-box;
}

.with-icon {
  padding-left: 48px;
}

.with-toggle {
  padding-right: 48px;
}

.input-field:focus {
  outline: none;

  border-color: var(--color-accent);

  background: var(--color-surface);
}

.input-field:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-password {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  background: none;
  border: none;

  cursor: pointer;

  color: var(--color-text-muted);

  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--color-text-primary);
}
</style>
