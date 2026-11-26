<!-- 全局提示出口（A 负责）：App.vue 里挂一次，页面用 useToast() 发消息 -->
<script setup>
import { useToast } from '../../composables/useToast.js'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="toast"
        :class="`toast--${item.type}`"
        role="status"
      >
        <span class="toast__mark" aria-hidden="true">
          {{ item.type === 'success' ? '✓' : item.type === 'error' ? '!' : item.type === 'warning' ? '△' : 'i' }}
        </span>
        <span class="toast__text">{{ item.message }}</span>
        <button type="button" class="toast__close" aria-label="关闭提示" @click="dismiss(item.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  left: 50%;
  bottom: calc(var(--sp-5) + env(safe-area-inset-bottom, 0px));
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  transform: translateX(-50%);
  width: min(92vw, 420px);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--ink);
  color: var(--paper);
  border: 2px solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard);
  padding: 10px 12px;
  font-size: var(--fs-sm);
  pointer-events: auto;
}

.toast__mark {
  flex: none;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--sun);
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
}

.toast--success .toast__mark {
  background: var(--mint);
}

.toast--error .toast__mark {
  background: var(--coral);
  color: #fff;
}

.toast--warning .toast__mark {
  background: var(--sun);
}

.toast__text {
  flex: 1;
  line-height: 1.4;
}

.toast__close {
  flex: none;
  color: inherit;
  opacity: 0.6;
  font-size: 16px;
  line-height: 1;
}

.toast__close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--dur-base) var(--ease),
    transform var(--dur-base) var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
