<script setup>
// C · 手帐状态 tab。计数由 A 的 useStats().statusDistribution 提供，口径不自己算。
import BaseTag from '../ui/BaseTag.vue'

const props = defineProps({
  modelValue: { type: String, default: '全部' },
  /** [{ value, label, count }]，顺序即 tab 顺序 */
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const tabs = () => [{ value: '全部', label: '全部', count: props.total }, ...props.items]

function select(value) {
  if (value !== props.modelValue) emit('update:modelValue', value)
}
</script>

<template>
  <div class="status-tabs" role="tablist" aria-label="手帐状态筛选">
    <BaseTag
      v-for="tab in tabs()"
      :key="tab.value"
      tone="lilac"
      size="md"
      clickable
      :active="modelValue === tab.value"
      :aria-selected="modelValue === tab.value"
      role="tab"
      @click="select(tab.value)"
    >
      {{ tab.label }}
      <span class="count">{{ tab.count }}</span>
    </BaseTag>
  </div>
</template>

<style scoped>
.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: var(--sp-4) 0 var(--sp-5);
}
.count {
  margin-left: var(--sp-1);
  font-size: var(--fs-xs);
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 767px) {
  .status-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: var(--sp-2);
  }
}
</style>
