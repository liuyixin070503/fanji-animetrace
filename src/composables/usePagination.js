/**
 * 分页：番剧库 8 条/页、手帐墙、论坛列表都能直接用。
 * 越界自动回第 1 页（验收项 F10）。
 */
import { computed, ref, unref, watch } from 'vue'

/**
 * @param {import('vue').Ref<any[]>|(()=>any[])|any[]} source 数据源（响应式）
 * @param {{pageSize?:number}} [options]
 */
export function usePagination(source, options = {}) {
  const pageSize = ref(options.pageSize || 8)
  const page = ref(1)

  const list = computed(() => {
    const raw = typeof source === 'function' ? source() : unref(source)
    return Array.isArray(raw) ? raw : []
  })

  const total = computed(() => list.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  const paged = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return list.value.slice(start, start + pageSize.value)
  })

  watch(totalPages, (next) => {
    if (page.value > next) page.value = 1
    if (page.value < 1) page.value = 1
  })

  watch(pageSize, () => {
    page.value = 1
  })

  function go(next) {
    page.value = Math.min(Math.max(1, next), totalPages.value)
  }

  const next = () => go(page.value + 1)
  const prev = () => go(page.value - 1)
  const reset = () => {
    page.value = 1
  }

  /** 页码数组，超过 7 页时用省略号（返回 '...' 字符串） */
  const pages = computed(() => {
    const last = totalPages.value
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
    const current = page.value
    const set = new Set([1, last, current, current - 1, current + 1])
    const sorted = [...set].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)
    const out = []
    sorted.forEach((n, index) => {
      if (index > 0 && n - sorted[index - 1] > 1) out.push('...')
      out.push(n)
    })
    return out
  })

  const rangeText = computed(() => {
    if (!total.value) return '共 0 条'
    const start = (page.value - 1) * pageSize.value + 1
    const end = Math.min(page.value * pageSize.value, total.value)
    return `第 ${start}–${end} 条 · 共 ${total.value} 条`
  })

  return {
    page,
    pageSize,
    total,
    totalPages,
    paged,
    pages,
    rangeText,
    go,
    next,
    prev,
    reset,
    setPageSize: (size) => {
      pageSize.value = size
    },
  }
}
