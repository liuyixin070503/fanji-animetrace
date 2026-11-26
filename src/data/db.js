/**
 * =========================================================
 * data/db.js —— 全项目唯一的数据出入口（接口冻结：11-27）
 * =========================================================
 * 页面组件里 **只准** 调这里导出的函数，不准直接摸 localStorage，
 * 也不准 import seed.js / types 里的数组去读业务数据（常量枚举可以）。
 *
 * 为什么要这层：四个页面共用一份数据，读写逻辑收在一处，
 * 换存储（localStorage → IndexedDB → 后端）时只改这一个文件。
 *
 * 约定：
 *   1. 所有读写都是同步的（localStorage 本来就同步），不返回 Promise；
 *   2. 返回的都是"副本"，页面改了不会污染库里的数据；
 *   3. 每次写操作都会让 dbTick 自增 —— 需要响应式的页面用
 *      computed(() => (db.dbTick.value, db.listJournal(id))) 这种方式刷新；
 *   4. 演示用的账号体系是本地模拟，不构成真实鉴权。
 */
import { ref } from 'vue'
import {
  DB_KEY,
  DB_VERSION,
  STATUS,
  STATUS_LIST,
  defaultJournalEntry,
  defaultPost,
  defaultComment,
} from '../types/db.js'
import { ANIME, buildSeed, pickAvatarSeed } from './seed.js'
import { hashPassword } from '../utils/hash.js'

/** 数据版本号：任何写操作都会让它 +1，页面用它触发重算 */
export const dbTick = ref(0)

/** "记住我" 7 天；不记住则本次会话 12 小时（演示足够） */
const REMEMBER_MS = 7 * 24 * 3600 * 1000
const SESSION_MS = 12 * 3600 * 1000

const DAY = 86400000

/** 内存缓存：一次读出，写回时同步更新 */
let cache = null

function hasStorage() {
  return typeof localStorage !== 'undefined'
}

function readRaw() {
  if (!hasStorage()) return null
  try {
    const raw = localStorage.getItem(DB_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.warn('[db] 本地数据解析失败，将重建演示数据', err)
    return null
  }
}

/** 不触发 dbTick 的写入：只在初始化/过期清理时用，避免渲染期自增死循环 */
function silentPersist(db) {
  cache = db
  if (!hasStorage()) return
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch (err) {
    console.warn('[db] 写入 localStorage 失败（可能是隐私模式或空间不足）', err)
  }
}

function persist(db) {
  silentPersist(db)
  dbTick.value += 1
}

/** 读到库；没有 / 版本不对 → 重写 seed */
function load() {
  if (cache) return cache
  const raw = readRaw()
  if (!raw || raw.version !== DB_VERSION || !Array.isArray(raw.journal)) {
    const fresh = buildSeed()
    silentPersist(fresh)
    return fresh
  }
  cache = {
    version: DB_VERSION,
    users: Array.isArray(raw.users) ? raw.users : [],
    journal: Array.isArray(raw.journal) ? raw.journal : [],
    posts: Array.isArray(raw.posts) ? raw.posts : [],
    comments: Array.isArray(raw.comments) ? raw.comments : [],
    session: raw.session ?? null,
  }
  return cache
}

/** 读-改-写：mutator 的返回值就是函数返回值 */
function write(mutator) {
  const db = load()
  const result = mutator(db)
  persist(db)
  return result
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

/** 对外只暴露公开字段，passwordDigest 永远不出这个文件 */
function publicUser(user) {
  if (!user) return null
  const rest = { ...user }
  delete rest.passwordDigest
  return clone(rest)
}

function text(value, max = 500) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max)
}

/* =========================================================
 * 番剧目录（静态，不写进 localStorage）
 * =======================================================*/

/** @returns {import('../types/db.js').Anime[]} 按 id 升序 */
export function listAnime() {
  return ANIME.map((anime) => clone(anime)).sort((a, b) => (a.id < b.id ? -1 : 1))
}

/** @param {string} id */
export function getAnime(id) {
  const anime = ANIME.find((item) => item.id === id)
  return anime ? clone(anime) : null
}

/* =========================================================
 * 手帐（JournalEntry）：收藏也在这张表里（favorite 字段）
 * =======================================================*/

/**
 * 某个用户的全部手帐，按最近更新倒序。
 * @param {string} userId
 */
export function listJournal(userId) {
  if (!userId) return []
  return load()
    .journal.filter((entry) => entry.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((entry) => clone(entry))
}

/** @param {string} id */
export function getJournal(id) {
  const entry = load().journal.find((item) => item.id === id)
  return entry ? clone(entry) : null
}

/**
 * 查"某用户对某番"的手帐，没有就返回 null。
 * 番剧详情弹窗用它判断该显示"加入手帐"还是"编辑手帐"。
 * @param {string} userId
 * @param {string} animeId
 */
export function getJournalByAnime(userId, animeId) {
  const entry = load().journal.find((item) => item.userId === userId && item.animeId === animeId)
  return entry ? clone(entry) : null
}

/** 把外部传进来的字段洗干净：进度夹在 0~总集数、评分 0.5 步进、心情最多 3 个 */
function normalizeJournal(entry, anime, now) {
  const maxEpisodes = anime ? anime.episodes : Math.max(1, Number(entry.progress) || 1)
  const status = STATUS_LIST.includes(entry.status) ? entry.status : STATUS.WANT

  let progress = Math.round(Number(entry.progress) || 0)
  progress = Math.min(Math.max(progress, 0), maxEpisodes)
  // 验收项：状态改成"看过"时自动补满进度
  if (status === STATUS.WATCHED) progress = maxEpisodes

  let score = entry.score
  if (score === '' || score === null || score === undefined) {
    score = null
  } else {
    score = Math.round(Number(score) * 2) / 2
    score = Math.min(Math.max(score, 0), 10)
    if (Number.isNaN(score)) score = null
  }

  const mood = Array.isArray(entry.mood) ? entry.mood.filter(Boolean).slice(0, 3) : []
  const tags = Array.isArray(entry.tags) ? entry.tags.filter(Boolean).slice(0, 8) : []

  return {
    animeId: entry.animeId || '',
    status,
    progress,
    score,
    favorite: Boolean(entry.favorite),
    review: text(entry.review, 200),
    quote: text(entry.quote, 60),
    mood,
    tags,
    startedAt:
      progress > 0
        ? entry.startedAt || (status === STATUS.WATCHED || status === STATUS.WATCHING ? now : null)
        : null,
    finishedAt: status === STATUS.WATCHED ? entry.finishedAt || now : null,
  }
}

/**
 * 新建 / 更新一条手帐（同一个用户对同一部番只保留一条）。
 * 传 id 或 userId+animeId 命中已有记录 → 更新；否则新建。
 * @param {Partial<import('../types/db.js').JournalEntry>} entry
 * @returns {import('../types/db.js').JournalEntry}
 */
export function saveJournal(entry = {}) {
  return write((db) => {
    const now = Date.now()
    const userId = entry.userId || (getSession() ? getSession().id : '')
    if (!userId) throw new Error('[db] saveJournal 需要登录用户')

    const anime = entry.animeId ? ANIME.find((item) => item.id === entry.animeId) : null
    let target = entry.id ? db.journal.find((item) => item.id === entry.id) : null
    if (!target && entry.animeId) {
      target = db.journal.find((item) => item.userId === userId && item.animeId === entry.animeId)
    }

    const merged = {
      ...(target || defaultJournalEntry({ id: uid('j'), userId, createdAt: now })),
      ...entry,
      userId,
      updatedAt: now,
    }
    const normalized = normalizeJournal(merged, anime, now)
    const next = { ...merged, ...normalized, userId, updatedAt: now }

    if (target) {
      Object.assign(target, next)
      return clone(target)
    }
    db.journal.push(next)
    return clone(next)
  })
}

/** @param {string} id */
export function removeJournal(id) {
  return write((db) => {
    const before = db.journal.length
    db.journal = db.journal.filter((item) => item.id !== id)
    return db.journal.length !== before
  })
}

/**
 * 收藏 / 取消收藏。没有手帐时自动建一条"想看 + 已收藏"，
 * 这样 B 的海报卡片只需要一个按钮。
 * @param {string} animeId
 * @param {string} [userId] 省略则取当前登录用户
 * @returns {{favorite:boolean, entry:import('../types/db.js').JournalEntry}|null}
 */
export function toggleFavorite(animeId, userId) {
  return write((db) => {
    const now = Date.now()
    const uidNow = userId || (getSession() ? getSession().id : '')
    if (!uidNow) return null
    const anime = ANIME.find((item) => item.id === animeId)

    let entry = db.journal.find((item) => item.userId === uidNow && item.animeId === animeId)
    if (!entry) {
      entry = defaultJournalEntry({
        id: uid('j'),
        userId: uidNow,
        animeId,
        status: STATUS.WANT,
        favorite: true,
        tags: anime ? anime.tags.slice(0, 3) : [],
        createdAt: now,
        updatedAt: now,
      })
      db.journal.push(entry)
    } else {
      entry.favorite = !entry.favorite
      entry.updatedAt = now
    }
    return { favorite: entry.favorite, entry: clone(entry) }
  })
}

/* =========================================================
 * 论坛
 * =======================================================*/

/**
 * 全部帖子，按发帖时间倒序。热度排序由 D 在页面里算（点赞×2 + 评论×3）。
 * @param {{board?:string}} [filter]
 */
export function listPosts(filter = {}) {
  const posts = load().posts
  const list = filter.board ? posts.filter((post) => post.board === filter.board) : posts
  return list
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((post) => clone(post))
}

/** @param {string} id */
export function getPost(id) {
  const post = load().posts.find((item) => item.id === id)
  return post ? clone(post) : null
}

/**
 * 新建 / 更新帖子。
 * @param {Partial<import('../types/db.js').Post>} post
 */
export function savePost(post = {}) {
  return write((db) => {
    const now = Date.now()
    const authorId = post.authorId || (getSession() ? getSession().id : '')
    if (!authorId) throw new Error('[db] savePost 需要登录用户')

    const target = post.id ? db.posts.find((item) => item.id === post.id) : null
    const merged = {
      ...(target || defaultPost({ id: uid('p'), authorId, createdAt: now })),
      ...post,
      authorId,
    }
    merged.title = text(merged.title, 40)
    merged.content = text(merged.content, 500)
    merged.animeId = merged.animeId || null

    if (target) {
      Object.assign(target, merged)
      return clone(target)
    }
    db.posts.push(merged)
    return clone(merged)
  })
}

/**
 * 发评论。
 * @param {{postId:string, content:string, authorId?:string}} payload
 */
export function addComment(payload = {}) {
  return write((db) => {
    const now = Date.now()
    const authorId = payload.authorId || (getSession() ? getSession().id : '')
    if (!authorId) throw new Error('[db] addComment 需要登录用户')
    if (!payload.postId) throw new Error('[db] addComment 需要 postId')

    const comment = defaultComment({
      id: uid('c'),
      postId: payload.postId,
      authorId,
      content: text(payload.content, 200),
      createdAt: now,
    })
    db.comments.push(comment)
    return clone(comment)
  })
}

/** @param {string} postId 按时间正序（先发的在上） */
export function listComments(postId) {
  return load()
    .comments.filter((comment) => comment.postId === postId)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((comment) => clone(comment))
}

/**
 * 点赞 / 取消：likedBy 里存 userId，天然防重。
 * @param {string} postId
 * @param {string} [userId]
 * @returns {{liked:boolean, count:number, likedBy:string[]}|null}
 */
export function toggleLike(postId, userId) {
  return write((db) => {
    const uidNow = userId || (getSession() ? getSession().id : '')
    if (!uidNow) return null
    const post = db.posts.find((item) => item.id === postId)
    if (!post) return null

    const index = post.likedBy.indexOf(uidNow)
    if (index >= 0) post.likedBy.splice(index, 1)
    else post.likedBy.push(uidNow)

    return { liked: index < 0, count: post.likedBy.length, likedBy: [...post.likedBy] }
  })
}

/* =========================================================
 * 用户 / 会话
 * =======================================================*/

/** @param {string} id */
export function getUser(id) {
  return publicUser(load().users.find((user) => user.id === id))
}

/** 所有用户（公开字段），头像 / 作者名展示用 */
export function listUsers() {
  return load().users.map((user) => publicUser(user))
}

/**
 * 当前登录用户；会话过期或用户已删除时返回 null 并顺手清掉会话。
 * @returns {import('../types/db.js').User|null}
 */
export function getSession() {
  const db = load()
  const session = db.session
  if (!session || !session.userId) return null

  if (session.expiresAt && Date.now() >= session.expiresAt) {
    db.session = null
    silentPersist(db)
    return null
  }
  const user = db.users.find((item) => item.id === session.userId)
  if (!user) {
    db.session = null
    silentPersist(db)
    return null
  }
  return publicUser(user)
}

/** 当前登录用户 id，没登录返回空串 */
export function currentUserId() {
  const user = getSession()
  return user ? user.id : ''
}

/**
 * 登录。失败时返回 { ok:false, field, message }，页面直接把 field 定位到输入框。
 * @param {string} username
 * @param {string} password
 * @param {boolean} [remember] 记住我 7 天
 */
export function login(username, password, remember = true) {
  const db = load()
  const name = String(username || '').trim()
  if (!name) return { ok: false, field: 'username', message: '请输入用户名' }

  const user = db.users.find((item) => item.username.toLowerCase() === name.toLowerCase())
  if (!user) return { ok: false, field: 'username', message: '这个用户名还没有注册' }
  if (user.passwordDigest !== hashPassword(String(password || ''))) {
    return { ok: false, field: 'password', message: '密码不对，再试一次' }
  }

  const now = Date.now()
  db.session = {
    userId: user.id,
    remember: Boolean(remember),
    loginAt: now,
    expiresAt: now + (remember ? REMEMBER_MS : SESSION_MS),
  }
  persist(db)
  return { ok: true, user: publicUser(user) }
}

/**
 * 注册并自动登录。
 * @param {{username:string, nickname:string, password:string}} payload
 */
export function register(payload = {}) {
  const db = load()
  const username = String(payload.username || '').trim()
  const nickname = String(payload.nickname || '').trim()
  const password = String(payload.password || '')

  if (!username) {
    return { ok: false, field: 'username', message: '请填写用户名' }
  }
  if (db.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, field: 'username', message: '这个用户名已经有人用了' }
  }
  if (!nickname) {
    return { ok: false, field: 'nickname', message: '请填写昵称' }
  }
  if (!password) {
    return { ok: false, field: 'password', message: '请设置密码' }
  }

  const now = Date.now()
  const user = {
    id: uid('u'),
    username,
    nickname,
    avatarSeed: pickAvatarSeed(db.users.length),
    bio: '',
    joinedAt: now,
    passwordDigest: hashPassword(password),
  }
  db.users.push(user)
  db.session = { userId: user.id, remember: true, loginAt: now, expiresAt: now + REMEMBER_MS }
  persist(db)
  return { ok: true, user: publicUser(user) }
}

/** 退出登录（只清会话，不动数据） */
export function logout() {
  return write((db) => {
    db.session = null
    return true
  })
}

/**
 * 改昵称 / 签名 / 头像色（个人中心 E 用）。
 * @param {{nickname?:string, bio?:string, avatarSeed?:string}} patch
 * @param {string} [userId]
 */
export function updateUser(patch = {}, userId) {
  return write((db) => {
    const uidNow = userId || (getSession() ? getSession().id : '')
    const user = db.users.find((item) => item.id === uidNow)
    if (!user) return null
    if (typeof patch.nickname === 'string' && patch.nickname.trim()) {
      user.nickname = patch.nickname.trim().slice(0, 12)
    }
    if (typeof patch.bio === 'string') user.bio = patch.bio.trim().slice(0, 40)
    if (typeof patch.avatarSeed === 'string') user.avatarSeed = patch.avatarSeed
    return publicUser(user)
  })
}

/* =========================================================
 * 兜底与重置
 * =======================================================*/

/**
 * 兜底读取：select('posts') / select('journal') ...
 * 正常业务请用上面的具名函数，这个只给调试和统计用。
 * @param {'users'|'journal'|'posts'|'comments'} table
 */
export function select(table) {
  const db = load()
  const value = db[table]
  return Array.isArray(value) ? clone(value) : []
}

/**
 * 清空并重建演示数据（个人中心"重置演示数据"按钮用）。
 * 会顺手退出登录，页面应跳回 /login。
 */
export function resetAll() {
  const fresh = buildSeed()
  cache = fresh
  persist(fresh)
  return true
}

/** 调试用：把当前库整个打出来（不对外暴露在页面里） */
export function dump() {
  return clone(load())
}

/** 时间常量，页面算"还剩几天"时可以复用 */
export const TIME = { DAY, REMEMBER_MS, SESSION_MS }
