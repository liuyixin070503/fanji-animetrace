<!-- 基础文本域（A 负责）：带字数统计，短评 200 / 金句 60 / 正文 500 都用它 -->
<script setup>
import { computed } from 'vue'

const model = defineModel({ type: String, default: '' })
const props = defineProps({
  id: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  maxlength: { type: Number, default: 200 },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showCount: { type: Boolean, default: true },
})

const emit = defineEmits(['blur'])
const fieldId = computed(() => props.id || `textarea-${Math.random().toString(36).slice(2, 8)}`)
const count = computed(() => (model.value ? model.value.length : 0))
const nearLimit = computed(() => count.value > props.maxlength * 0.9)

function onInput(event) {
  model.value = event.target.value
}
</script>

<template>
  <div class="field" :class="{ 'is-error': !!error }">
    <div class="field__head">
      <label v-if="label" class="field__label" :for="fieldId">
        {{ label }}
        <span v-if="required" class="field__req" aria-hidden="true">*</span>
      </label>
      <span v-if="showCount" class="field__count" :class="{ 'is-near': nearLimit }">
        {{ count }} / {{ maxlength }}
      </span>
    </div>

    <textarea
      :id="fieldId"
      class="field__area"
      :value="model"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :aria-invalid="!!error"
      @input="onInput"
      @blur="emit('blur', $event)"
    ></textarea>

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

.field__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.field__label {
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--ink-2);
}

.field__req {
  color: var(--danger);
  margin-left: 2px;
}

.field__count {
  font-size: var(--fs-xs);
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.field__count.is-near {
  color: var(--warning);
  font-weight: 700;
}

.field__area {
  width: 100%;
  resize: vertical;
  min-height: 96px;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard-sm);
  padding: 10px 12px;
  font-size: var(--fs-base);
  line-height: var(--lh-base);
  outline: none;
}

.field__area:focus {
  background: #fff;
  box-shadow: 3px 3px 0 var(--coral);
}

.field__area::placeholder {
  color: #a9a29a;
}

.is-error .field__area {
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
