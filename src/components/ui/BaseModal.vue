<!--
  基础弹窗（A 负责）
  已处理：Esc 关闭、点遮罩关闭、焦点进入/归还、Tab 循环、body 滚动锁定。
  番剧详情、发帖、确认框全部复用它。
-->
<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const open = defineModel({ type: Boolean, default: false })

const props = defineProps({
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['close', 'opened'])

const panel = ref(null)
let lastActive = null

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function close() {
  if (!props.closable) return
  open.value = false
  emit('close')
}

function onBackdrop(event) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) close()
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key !== 'Tab' || !panel.value) return
  const nodes = panel.value.querySelectorAll(FOCUSABLE)
  if (!nodes.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(open, async (value) => {
  if (typeof document === 'undefined') return
  if (value) {
    lastActive = document.activeElement
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    const target = panel.value?.querySelector('[data-autofocus]') || panel.value
    if (target && target.focus) target.focus()
    emit('opened')
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
    if (lastActive && lastActive.focus) lastActive.focus()
    lastActive = null
  }
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="onBackdrop">
        <div
          ref="panel"
          class="modal__panel"
          :class="`modal__panel--${size}`"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <header v-if="title || $slots.header" class="modal__head">
            <slot name="header">
              <h2 class="modal__title">{{ title }}</h2>
            </slot>
            <button
              v-if="closable"
              type="button"
              class="modal__close"
              aria-label="关闭"
              @click="close"
            >
              ×
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  background: rgba(27, 27, 27, 0.5);
  backdrop-filter: blur(2px);
}

.modal__panel {
  width: 100%;
  max-height: calc(100dvh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hard-lg);
  outline: none;
}

.modal__panel--sm {
  max-width: 380px;
}
.modal__panel--md {
  max-width: 560px;
}
.modal__panel--lg {
  max-width: 760px;
}

.modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-4) var(--sp-2);
  border-bottom: 2px dashed rgba(27, 27, 27, 0.18);
}

.modal__title {
  font-size: var(--fs-lg);
  font-weight: 800;
}

.modal__close {
  flex: none;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  font-size: 22px;
  line-height: 1;
  border: 2px solid var(--ink);
  border-radius: var(--r-sm);
  background: var(--paper);
  box-shadow: 2px 2px 0 var(--ink);
}

.modal__close:hover {
  background: var(--coral);
  color: #fff;
}

.modal__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--sp-4);
}

.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-top: 2px dashed rgba(27, 27, 27, 0.18);
}

/* 进出场：从下方 8px 弹上来，够快不拖沓 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) var(--ease);
}

.modal-enter-active .modal__panel,
.modal-leave-active .modal__panel {
  transition: transform var(--dur-base) var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__panel,
.modal-leave-to .modal__panel {
  transform: translateY(12px) scale(0.98);
}
</style>
