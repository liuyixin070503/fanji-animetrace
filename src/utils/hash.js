/**
 * 本地口令摘要（课程演示用，不构成真实鉴权）。
 * 只求"别在 localStorage 里看到明文"，不是安全哈希。
 */
const SALT = 'fanji.v1'

/**
 * @param {string} password
 * @returns {string}
 */
export function hashPassword(password) {
  const src = `${SALT}::${password}`
  let h1 = 0x811c9dc5
  let h2 = 0x1000193
  for (let i = 0; i < src.length; i += 1) {
    const code = src.charCodeAt(i)
    h1 ^= code
    h1 = Math.imul(h1, 16777619) >>> 0
    h2 = Math.imul(h2 ^ code, 2654435761) >>> 0
  }
  return `h1_${h1.toString(16)}${h2.toString(16)}`
}
