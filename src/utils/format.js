/** 展示层格式化工具：所有页面共用，别各写一套日期格式 */

/**
 * @param {number|null|undefined} ms
 * @returns {string} 2026.11.26
 */
export function formatDate(ms) {
  if (!ms) return '—'
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

/**
 * @param {number|null|undefined} ms
 * @returns {string} 2026.11.26 18:20
 */
export function formatDateTime(ms) {
  if (!ms) return '—'
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${formatDate(ms)} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/**
 * 相对时间：刚刚 / 5 分钟前 / 3 小时前 / 2 天前 / 2026.01.02
 * @param {number} ms
 * @returns {string}
 */
export function fromNow(ms) {
  if (!ms) return '—'
  const diff = Date.now() - ms
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / 86400000)} 天前`
  return formatDate(ms)
}

/**
 * 评分展示：9 → 9.0，9.35 → 9.4，null → —
 * @param {number|null|undefined} score
 * @param {number} [digits]
 */
export function formatScore(score, digits = 1) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) return '—'
  return Number(score).toFixed(digits)
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * 300ms 防抖（搜索框验收项 F05 的口径）
 * @param {Function} fn
 * @param {number} [wait]
 */
export function debounce(fn, wait = 300) {
  let timer = null
  const wrapped = (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, wait)
  }
  wrapped.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return wrapped
}

/**
 * 进度文案：第 14 / 28 集 · 未开始 · 全 12 集
 * @param {number} progress
 * @param {number} episodes
 */
export function progressText(progress, episodes) {
  if (!episodes) return '—'
  if (!progress) return '未开始'
  if (progress >= episodes) return `全 ${episodes} 集`
  return `第 ${progress} / ${episodes} 集`
}

/**
 * 头像首字：取昵称第一个字符
 * @param {string} nickname
 */
export function initialOf(nickname = '') {
  return nickname.trim().slice(0, 1) || '番'
}
