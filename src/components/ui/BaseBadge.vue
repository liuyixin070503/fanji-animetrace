<!-- 状态角标（A 负责）：传 status 自动取颜色和文案，不要各页面手写五种色 -->
<script setup>
import { computed } from 'vue'
import { STATUS_META } from '../../types/db.js'

const props = defineProps({
  status: { type: String, default: '' },
  label: { type: String, default: '' },
  tone: { type: String, default: '' },
  /** 是否显示左侧小方块 */
  dot: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
})

const meta = computed(() => (props.status ? STATUS_META[props.status] : null))
const text = computed(() => props.label || (meta.value ? meta.value.label : ''))
const colorVar = computed(() => {
  if (props.tone) return `var(--${props.tone})`
  return meta.value ? `var(${meta.value.token})` : 'var(--sun)'
})
</script>

<template>
  <span v-if="text" class="badge" :class="[`badge--${size}`]">
    <span v-if="dot" class="badge__dot" :style="{ background: colorVar }" aria-hidden="true"></span>
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid var(--ink);
  border-radius: var(--r-pill);
  background: var(--paper-3);
  padding: 3px 10px;
  font-size: var(--fs-xs);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.badge--sm {
  padding: 2px 8px;
  font-size: 11px;
}

.badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  border: 1px solid rgba(27, 27, 27, 0.5);
}
</style>
