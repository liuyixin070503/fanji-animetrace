<!-- 空状态（A 负责）：列表没数据、筛选无结果都走它，别自己写"暂无数据" -->
<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  title: { type: String, default: '这里还空着' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  /** 顶部的大字符/emoji，默认给一个手帐味的符号 */
  icon: { type: String, default: '✎' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty" role="status">
    <div class="empty__icon" aria-hidden="true">{{ icon }}</div>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="description" class="empty__desc">{{ description }}</p>
    <div v-if="actionLabel || $slots.action" class="empty__action">
      <slot name="action">
        <BaseButton variant="solid" size="sm" @click="emit('action')">{{ actionLabel }}</BaseButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-8) var(--sp-4);
  text-align: center;
  border: 2px dashed rgba(27, 27, 27, 0.3);
  border-radius: var(--r-md);
  background: rgba(255, 253, 247, 0.6);
}

.empty__icon {
  font-family: var(--font-display);
  font-size: 40px;
  line-height: 1;
  color: var(--coral);
}

.empty__title {
  font-size: var(--fs-md);
  font-weight: 800;
}

.empty__desc {
  max-width: 34ch;
  font-size: var(--fs-sm);
  color: var(--ink-3);
}

.empty__action {
  margin-top: var(--sp-2);
}
</style>
