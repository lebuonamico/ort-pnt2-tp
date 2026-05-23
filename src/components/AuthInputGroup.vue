<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'

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

    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      :style="{ textAlign: labelAlign }"
      class="input-label"
    >
      {{ label }}
    </label>

    <!-- Input Wrapper -->
    <div class="input-wrapper">

      <!-- Icon -->
      <span
        v-if="icon"
        class="material-symbols-outlined input-icon"
      >
        {{ icon }}
      </span>

      <!-- Input -->
      <input
        :id="id"
        :type="internalType"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput"
        :class="['input-field', inputClasses]"
      />

      <!-- Right Slot -->
      <slot name="append">

        <!-- Password Toggle -->
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

/* LABEL */

.input-label {
  width: 100%;

  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;

  color: #475569;
}

/* WRAPPER */

.input-wrapper {
  position: relative;
  width: 100%;
}

/* ICON */

.input-icon {
  position: absolute;

  left: 14px;
  top: 50%;

  transform: translateY(-50%);

  color: #64748b;
  font-size: 20px;

  pointer-events: none;
}

/* INPUT */

.input-field {
  width: 100%;

  padding: 14px 16px;

  border: 2px solid transparent;
  border-radius: 14px;

  background: #f1f5f9;

  font-family: 'Work Sans', sans-serif;
  font-size: 16px;

  color: #0b1c30;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  box-sizing: border-box;
}

/* INPUT WITH ICON */

.with-icon {
  padding-left: 48px;
}

/* INPUT WITH TOGGLE */

.with-toggle {
  padding-right: 48px;
}

/* INPUT FOCUS */

.input-field:focus {
  outline: none;

  border-color: #006a61;

  background: white;
}

/* DISABLED */

.input-field:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* TOGGLE PASSWORD */

.toggle-password {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  background: none;
  border: none;

  cursor: pointer;

  color: #64748b;

  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #334155;
}
</style>

