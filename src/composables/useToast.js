/**
 * 轻量 toast（12 个基础件之外唯一允许的"全局提示"）。
 * 用法：const toast = useToast(); toast.success('已保存')
 * 渲染在 <ToastHost /> 里，App.vue 已经挂好了。
 */
import { reactive } from 'vue'

const MAX = 4
const state = reactive({ items: [] })
const timers = new Map()
let seq = 0

function dismiss(id) {
  const index = state.items.findIndex((item) => item.id === id)
  if (index >= 0) state.items.splice(index, 1)
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

/**
 * @param {string} message
 * @param {{type?:'info'|'success'|'error'|'warning', duration?:number}} [options]
 */
function show(message, options = {}) {
  const id = (seq += 1)
  const type = options.type || 'info'
  const duration = options.duration ?? 2600
  state.items.push({ id, message, type })
  while (state.items.length > MAX) dismiss(state.items[0].id)
  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    )
  }
  return id
}

export function useToast() {
  return {
    toasts: state.items,
    show,
    success: (message, options) => show(message, { ...options, type: 'success' }),
    error: (message, options) => show(message, { ...options, type: 'error' }),
    warning: (message, options) => show(message, { ...options, type: 'warning' }),
    info: (message, options) => show(message, { ...options, type: 'info' }),
    dismiss,
  }
}
