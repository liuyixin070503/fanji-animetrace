<!-- 标签/筛选片（A 负责）：可点击切换，也可带删除叉 -->
<script setup>
defineProps({
  label: { type: String, default: '' },
  tone: { type: String, default: 'paper' },
  active: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  removable: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['click', 'remove'])
</script>

<template>
  <component
    :is="clickable ? 'button' : 'span'"
    :type="clickable ? 'button' : undefined"
    class="tag"
    :class="[`tag--${tone}`, `tag--${size}`, { 'is-active': active, 'is-clickable': clickable }]"
    :aria-pressed="clickable ? active : undefined"
    @click="clickable ? emit('click') : null"
  >
    <slot>{{ label }}</slot>
    <button
      v-if="removable"
      type="button"
      class="tag__x"
      :aria-label="`移除 ${label}`"
      @click.stop="emit('remove')"
    >
      ×
    </button>
  </component>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1.5px solid var(--ink);
  border-radius: var(--r-pill);
  background: var(--paper-3);
  color: var(--ink);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.tag--sm {
  padding: 3px 8px;
  font-size: 11px;
}

.tag--md {
  padding: 5px 12px;
  font-size: var(--fs-xs);
}

.tag--lg {
  padding: 8px 16px;
  font-size: var(--fs-sm);
}

.tag.is-clickable {
  cursor: pointer;
  transition:
    background-color var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}

.tag.is-clickable:hover {
  transform: translateY(-1px);
}

.tag.is-active {
  background: var(--ink);
  color: var(--paper);
}

.tag--sun {
  background: var(--sun-soft);
}
.tag--mint {
  background: var(--mint-soft);
}
.tag--sky {
  background: var(--sky-soft);
}
.tag--pink {
  background: var(--pink-soft);
}
.tag--lilac {
  background: var(--lilac-soft);
}

.tag__x {
  border: none;
  background: transparent;
  padding: 0 0 0 2px;
  font-size: 13px;
  line-height: 1;
  color: inherit;
  opacity: 0.6;
}

.tag__x:hover {
  opacity: 1;
}
</style>
