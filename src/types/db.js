/**
 * =========================================================
 * types/db.js —— 数据契约（接口冻结日：11-27）
 * =========================================================
 * 这里只有"结构"和"常量"，没有任何读写逻辑：
 *   - 实体长什么样（JSDoc typedef，编辑器里能直接提示字段）
 *   - 状态/板块/心情的枚举
 *   - 新建记录的默认模板
 *   - localStorage 的 key 与版本号
 *
 * 谁都不能改这个文件的字段名。要加字段，先在群里说，A 统一加。
 */

/** localStorage 唯一键 */
export const DB_KEY = 'fanji.db.v1'

/**
 * 数据结构版本号。
 * 改动任何实体字段 → +1，页面下次刷新会自动重写 seed（旧数据丢弃）。
 * 演示前想重置数据，也可以手动改这个号。
 */
export const DB_VERSION = 1

/** 观看状态：全站唯一的五个值，别自己造词 */
export const STATUS = {
  WANT: '想看',
  WATCHING: '在看',
  WATCHED: '看过',
  HOLD: '搁置',
  DROP: '弃番',
}

/** 展示顺序：手帐墙 tab、统计环图都用这个顺序 */
export const STATUS_LIST = [STATUS.WATCHING, STATUS.WATCHED, STATUS.WANT, STATUS.HOLD, STATUS.DROP]

/** 状态 → 展示元信息（颜色变量名、角标文案） */
export const STATUS_META = {
  [STATUS.WANT]: { label: '想看', token: '--st-want', cls: 'is-want' },
  [STATUS.WATCHING]: { label: '在看', token: '--st-watching', cls: 'is-watching' },
  [STATUS.WATCHED]: { label: '看过', token: '--st-watched', cls: 'is-watched' },
  [STATUS.HOLD]: { label: '搁置', token: '--st-hold', cls: 'is-hold' },
  [STATUS.DROP]: { label: '弃番', token: '--st-drop', cls: 'is-drop' },
}

/** 论坛板块：顺序即 tab 顺序 */
export const BOARDS = ['讨论', '求推荐', '吐槽', '资源/情报']

/** 手帐心情标签（chips 多选，最多 3 个） */
export const MOODS = ['燃', '泪目', '治愈', '致郁', '上头', '封神', '意难平', '下饭']

/** 番剧标签池：seed 与筛选项都从这里取，避免各写一套 */
export const TAG_POOL = [
  '奇幻',
  '治愈',
  '公路',
  '热血',
  '悬疑',
  '科幻',
  '日常',
  '恋爱',
  '青春',
  '音乐',
  '战斗',
  '家庭',
  '搞笑',
  '剧情',
  '猎奇',
]

/**
 * @typedef {Object} Anime
 * @property {string} id            a001 ~ a010
 * @property {string} title         中文名
 * @property {string} titleJp       日文名（搜索要能命中）
 * @property {number} year          年份
 * @property {'TV'|'剧场版'} type
 * @property {number} episodes      总集数（剧场版填 1）
 * @property {string} studio        制作公司
 * @property {string[]} tags        标签
 * @property {string} summary       简介
 * @property {{src:string, source:string, credit:string}} cover 海报
 * @property {string} accent        卡片强调色（HEX）
 * @property {number} externalScore 站外评分（列表"评分"排序用）
 * @property {number} popularity    热度 0-100
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username      登录名（3-16 位，唯一）
 * @property {string} nickname      昵称（2-12 字）
 * @property {string} avatarSeed    头像底色种子（前端按它取色）
 * @property {string} bio           签名 ≤40 字
 * @property {number} joinedAt      毫秒
 * @property {string} passwordDigest 摘要（不存明文）
 */

/**
 * @typedef {Object} JournalEntry 一条手帐 = 一个用户对一部番的私人记录（收藏也收在这里）
 * @property {string} id
 * @property {string} userId
 * @property {string} animeId
 * @property {string} status        五选一，见 STATUS
 * @property {number} progress      看到第几集，0 ≤ progress ≤ episodes
 * @property {number|null} score    0-10，0.5 步进；null = 未打分
 * @property {boolean} favorite     是否收藏
 * @property {string} review        短评 0-200 字
 * @property {string} quote         金句 0-60 字
 * @property {string[]} mood        心情标签，最多 3 个
 * @property {string[]} tags        标签（导入时默认取番剧标签）
 * @property {number|null} startedAt
 * @property {number|null} finishedAt
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} authorId
 * @property {string|null} animeId  可关联番剧
 * @property {string} board         见 BOARDS
 * @property {string} title         5-40 字
 * @property {string} content       10-500 字
 * @property {number} createdAt
 * @property {string[]} likedBy     点过赞的 userId，防重就靠它
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} postId
 * @property {string} authorId
 * @property {string} content       1-200 字
 * @property {number} createdAt
 */

/** @param {string} status */
export function isStatus(status) {
  return STATUS_LIST.includes(status)
}

/** @param {string} board */
export function isBoard(board) {
  return BOARDS.includes(board)
}

/**
 * 手帐默认模板。B 调 toggleFavorite 建条目时就用它补全，
 * 这样 C 的详情页永远读不到 undefined。
 * @param {Partial<JournalEntry>} [overrides]
 * @returns {JournalEntry}
 */
export function defaultJournalEntry(overrides = {}) {
  return {
    id: '',
    userId: '',
    animeId: '',
    status: STATUS.WANT,
    progress: 0,
    score: null,
    favorite: false,
    review: '',
    quote: '',
    mood: [],
    tags: [],
    startedAt: null,
    finishedAt: null,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

/**
 * @param {Partial<Post>} [overrides]
 * @returns {Post}
 */
export function defaultPost(overrides = {}) {
  return {
    id: '',
    authorId: '',
    animeId: null,
    board: BOARDS[0],
    title: '',
    content: '',
    createdAt: 0,
    likedBy: [],
    ...overrides,
  }
}

/**
 * @param {Partial<Comment>} [overrides]
 * @returns {Comment}
 */
export function defaultComment(overrides = {}) {
  return {
    id: '',
    postId: '',
    authorId: '',
    content: '',
    createdAt: 0,
    ...overrides,
  }
}
