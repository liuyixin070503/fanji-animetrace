<!--
  基础按钮（A 负责）
  静态稿里的按钮统一是：2px 墨黑描边 + 4px 硬投影 + 按下时位移。
  variant: solid(柠檬) / coral(珊瑚) / dark(墨黑) / soft(纸) / ghost(透明) / danger
  size: sm / md / lg
-->
<script setup>
defineProps({
  variant: { type: String, default: 'solid' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'is-loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard-sm);
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.btn:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--ink);
}

.btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
}

.btn--block {
  display: flex;
  width: 100%;
}

/* ---- 尺寸 ---- */
.btn--sm {
  padding: 6px 12px;
  font-size: var(--fs-sm);
}

.btn--md {
  padding: 10px 18px;
  font-size: var(--fs-base);
}

.btn--lg {
  padding: 14px 24px;
  font-size: var(--fs-md);
}

/* ---- 配色 ---- */
.btn--solid {
  background: var(--sun);
  color: var(--ink);
}

.btn--solid:hover:not(:disabled) {
  background: #ffe373;
}

.btn--coral {
  background: var(--coral);
  color: #fff;
}

.btn--coral:hover:not(:disabled) {
  background: var(--coral-deep);
}

.btn--dark {
  background: var(--ink);
  color: var(--paper);
  box-shadow: 2px 2px 0 rgba(27, 27, 27, 0.35);
}

.btn--soft {
  background: var(--paper-3);
  color: var(--ink);
}

.btn--soft:hover:not(:disabled) {
  background: var(--paper-2);
}

.btn--ghost {
  background: transparent;
  color: var(--ink);
  border-color: transparent;
  box-shadow: none;
}

.btn--ghost:hover:not(:disabled) {
  background: rgba(27, 27, 27, 0.06);
  box-shadow: none;
  transform: none;
}

.btn--danger {
  background: var(--danger);
  color: #fff;
}

.btn--danger:hover:not(:disabled) {
  background: #c53f33;
}

/* ---- loading ---- */
.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
