/**
 * 表单三件套：values / errors / handleSubmit。
 * 校验规则是纯函数 (value, values) => string | null，可以自由组合。
 *
 * const form = useForm({ username: '', password: '' }, {
 *   username: [required('请输入用户名'), pattern(/^[A-Za-z0-9_]{3,16}$/, '3–16 位字母数字下划线')],
 *   password: [required('请输入密码'), minLength(6, '至少 6 位')],
 * })
 */
import { computed, reactive, ref } from 'vue'

/* ---------------- 规则工厂 ---------------- */

/** @param {string} message */
export const required = (message = '这一项不能为空') => (value) => {
  if (value === null || value === undefined) return message
  if (Array.isArray(value)) return value.length ? null : message
  return String(value).trim() ? null : message
}

/** @param {number} n @param {string} [message] */
export const minLength = (n, message) => (value) =>
  String(value ?? '').trim().length >= n ? null : message || `至少 ${n} 个字`

/** @param {number} n @param {string} [message] */
export const maxLength = (n, message) => (value) =>
  String(value ?? '').length <= n ? null : message || `最多 ${n} 个字`

/** @param {RegExp} regex @param {string} message */
export const pattern = (regex, message) => (value) =>
  !String(value ?? '') || regex.test(String(value)) ? null : message

/** @param {string} key 另一个字段名 @param {string} [message] */
export const sameAs = (key, message) => (value, values) =>
  value === values[key] ? null : message || '两次输入不一致'

/** @param {(value:any, values:any)=>boolean} fn @param {string} message */
export const custom = (fn, message) => (value, values) => (fn(value, values) ? null : message)

/* ---------------- 主函数 ---------------- */

/**
 * @param {Record<string, any>} initial
 * @param {Record<string, Array<(value:any, values:any)=>string|null>>} [rules]
 */
export function useForm(initial = {}, rules = {}) {
  const values = reactive({ ...initial })
  const errors = reactive({})
  const touched = reactive({})
  const submitting = ref(false)

  /** 校验单个字段，返回是否通过 */
  function validateField(key) {
    const list = rules[key] || []
    for (const rule of list) {
      const message = rule(values[key], values)
      if (message) {
        errors[key] = message
        return false
      }
    }
    delete errors[key]
    return true
  }

  /** 校验全部字段（会标脏所有字段，让错误一起显示出来） */
  function validate() {
    let ok = true
    Object.keys(rules).forEach((key) => {
      touched[key] = true
      if (!validateField(key)) ok = false
    })
    return ok
  }

  /** 失焦时才提示，不对着还没打完的字挑错 */
  function blur(key) {
    touched[key] = true
    validateField(key)
  }

  /**
   * 提交：先校验，通过后跑 fn(values)，期间 submitting=true 防连点。
   * @param {(values:any)=>any} fn
   */
  async function handleSubmit(fn) {
    if (submitting.value) return { ok: false, skipped: true }
    if (!validate()) return { ok: false, invalid: true }
    submitting.value = true
    try {
      const result = await fn(values)
      return { ok: true, result }
    } catch (err) {
      console.error('[form] 提交失败', err)
      return { ok: false, error: err }
    } finally {
      submitting.value = false
    }
  }

  /** 重置为初始值（或传入的新值） */
  function reset(next = initial) {
    Object.keys(values).forEach((key) => {
      values[key] = next[key] ?? initial[key]
      delete errors[key]
      delete touched[key]
    })
  }

  /** 把后端/接口返回的字段错误贴到对应输入框 */
  function setError(key, message) {
    touched[key] = true
    errors[key] = message
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)
  const firstError = computed(() => {
    const key = Object.keys(errors)[0]
    return key ? errors[key] : ''
  })

  return {
    values,
    errors,
    touched,
    submitting,
    hasErrors,
    firstError,
    validate,
    validateField,
    blur,
    handleSubmit,
    reset,
    setError,
  }
}
