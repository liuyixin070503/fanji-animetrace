<!-- 二次确认（A 负责）：删除手帐、重置数据、退出登录都过这一层 -->
<script setup>
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const open = defineModel({ type: Boolean, default: false })

defineProps({
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  danger: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])

function onCancel() {
  open.value = false
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <BaseModal v-model="open" size="sm" :title="title" @close="emit('cancel')">
    <p class="confirm__message">{{ message }}</p>
    <template #footer>
      <BaseButton variant="soft" size="sm" @click="onCancel">{{ cancelText }}</BaseButton>
      <BaseButton
        :variant="danger ? 'danger' : 'solid'"
        size="sm"
        :loading="loading"
        data-autofocus
        @click="onConfirm"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm__message {
  font-size: var(--fs-base);
  color: var(--ink-2);
  line-height: var(--lh-base);
  white-space: pre-line;
}
</style>
