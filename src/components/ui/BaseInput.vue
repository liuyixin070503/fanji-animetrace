<!--
  基础输入框（A 负责）
  v-model 直接用；错误信息显示在字段下方（验收项：错误定位到字段）
-->
<script setup>
import { computed } from 'vue'

const model = defineModel({ type: [String, Number], default: '' })
const props = defineProps({
  id: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  maxlength: { type: [Number, String], default: undefined },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['blur', 'enter'])

const fieldId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 8)}`)
const errorId = computed(() => `${fieldId.value}-error`)

function onInput(event) {
  model.value = event.target.value
}

function onKeydown(event) {
  if (event.key === 'Enter') emit('enter', event)
}
</script>

<template>
  <div class="field" :class="[`field--${size}`, { 'is-error': !!error, 'is-disabled': disabled }]">
    <label v-if="label" class="field__label" :for="fieldId">
      {{ label }}
      <span v-if="required" class="field__req" aria-hidden="true">*</span>
    </label>

    <div class="field__box">
      <slot name="prefix" />
      <input
        :id="fieldId"
        class="field__input"
        :type="type"
        :value="model"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        :required="required"
        @input="onInput"
        @keydown="onKeydown"
        @blur="emit('blur', $event)"
      />
      <slot name="suffix" />
    </div>

    <p v-if="error" :id="errorId" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.field__label {
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--ink-2);
  letter-spacing: 0.02em;
}

.field__req {
  color: var(--danger);
  margin-left: 2px;
}

.field__box {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard-sm);
  padding: 0 10px;
  transition:
    box-shadow var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.field__box:focus-within {
  background: #fff;
  box-shadow: 3px 3px 0 var(--coral);
}

.field__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 0;
  font-size: var(--fs-base);
  color: var(--ink);
}

.field--lg .field__box {
  padding: 0 14px;
}

.field--lg .field__input {
  padding: 14px 0;
  font-size: var(--fs-md);
}

.field--sm .field__input {
  padding: 6px 0;
  font-size: var(--fs-sm);
}

.field__input::placeholder {
  color: #a9a29a;
}

.is-error .field__box {
  border-color: var(--danger);
  box-shadow: 2px 2px 0 var(--danger);
}

.field__error {
  font-size: var(--fs-xs);
  color: var(--danger);
  font-weight: 600;
}

.field__hint {
  font-size: var(--fs-xs);
  color: var(--ink-3);
}

.is-disabled .field__box {
  background: var(--paper-2);
  opacity: 0.7;
}
</style>
