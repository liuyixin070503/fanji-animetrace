<!-- 基础下拉（A 负责）：原生 select，保证移动端和键盘操作都不出问题 -->
<script setup>
import { computed } from 'vue'

const model = defineModel({ type: [String, Number], default: '' })
const props = defineProps({
  id: { type: String, default: '' },
  label: { type: String, default: '' },
  /** 字符串数组，或 { value, label } 数组 */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['change'])
const fieldId = computed(() => props.id || `select-${Math.random().toString(36).slice(2, 8)}`)
const normalized = computed(() =>
  props.options.map((item) =>
    typeof item === 'object' && item !== null ? item : { value: item, label: String(item) },
  ),
)

function onChange(event) {
  model.value = event.target.value
  emit('change', event.target.value)
}
</script>

<template>
  <div class="field" :class="[`field--${size}`, { 'is-error': !!error }]">
    <label v-if="label" class="field__label" :for="fieldId">{{ label }}</label>
    <div class="field__box">
      <select
        :id="fieldId"
        class="field__select"
        :value="model"
        :disabled="disabled"
        :aria-invalid="!!error"
        @change="onChange"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="item in normalized" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
      <span class="field__caret" aria-hidden="true"></span>
    </div>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
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
}

.field__box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard-sm);
}

.field__box:focus-within {
  box-shadow: 3px 3px 0 var(--coral);
}

.field__select {
  appearance: none;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 34px 10px 10px;
  font-size: var(--fs-base);
  cursor: pointer;
}

.field--lg .field__select {
  padding: 14px 38px 14px 14px;
}

.field__caret {
  position: absolute;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--ink);
  pointer-events: none;
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
</style>
