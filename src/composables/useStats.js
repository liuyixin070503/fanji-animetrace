/**
 * 统计口径统一出口：番剧库顶部四张卡、手帐墙计数、个人中心四张图
 * 全部读这里，保证三个页面对同一份数据给出同一个数（验收项 F23）。
 *
 * 口径（写死，别各自发明）：
 *   - 平均分：只算 score !== null 的条目，保留 2 位小数后展示 1 位
 *   - 已看完：status === 看过
 *   - 收藏：favorite === true（含“想看但收藏”的）
 *   - 集数：所有"看过"条目的总集数之和；时长按每集 24 分钟估算
 */
import { computed, isRef, unref } from 'vue'
import * as db from '../data/db.js'
import { STATUS, STATUS_LIST, STATUS_META } from '../types/db.js'

const MINUTES_PER_EPISODE = 24

/**
 * @param {string|import('vue').Ref<string>} [userId] 省略则取当前登录用户
 */
export function useStats(userId) {
  const uid = computed(() => (isRef(userId) ? unref(userId) : userId) || db.currentUserId())

  const entries = computed(() => {
    // 订阅数据版本号，写操作后自动重算
    void db.dbTick.value
    return db.listJournal(uid.value)
  })

  const posts = computed(() => {
    void db.dbTick.value
    return db.listPosts().filter((post) => post.authorId === uid.value)
  })

  const stats = computed(() => {
    const list = entries.value

    const byStatus = {}
    STATUS_LIST.forEach((status) => {
      byStatus[status] = 0
    })
    let watchedEpisodes = 0
    let scoreSum = 0
    let scoredCount = 0
    let favoriteCount = 0

    list.forEach((entry) => {
      if (byStatus[entry.status] !== undefined) byStatus[entry.status] += 1
      if (entry.status === STATUS.WATCHED) {
        const anime = db.getAnime(entry.animeId)
        watchedEpisodes += anime ? anime.episodes : entry.progress
      }
      if (entry.score !== null && entry.score !== undefined) {
        scoreSum += Number(entry.score)
        scoredCount += 1
      }
      if (entry.favorite) favoriteCount += 1
    })

    const statusDistribution = STATUS_LIST.map((status) => {
      const count = byStatus[status]
      return {
        status,
        label: STATUS_META[status].label,
        token: STATUS_META[status].token,
        count,
        percent: list.length ? Math.round((count / list.length) * 100) : 0,
      }
    })

    const buckets = [
      { label: '6–7', min: 6, max: 7 },
      { label: '7–8', min: 7, max: 8 },
      { label: '8–9', min: 8, max: 9 },
      { label: '9–10', min: 9, max: 10.01 },
    ].map((bucket) => ({ ...bucket, count: 0 }))
    list.forEach((entry) => {
      if (entry.score === null || entry.score === undefined) return
      const score = Number(entry.score)
      const hit = buckets.find((bucket) => score >= bucket.min && score < bucket.max)
      if (hit) hit.count += 1
    })

    const tagCounter = new Map()
    list.forEach((entry) => {
      ;(entry.tags || []).forEach((tag) => {
        tagCounter.set(tag, (tagCounter.get(tag) || 0) + 1)
      })
    })
    const tagPreference = [...tagCounter.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
    const tagMax = tagPreference.reduce((max, item) => Math.max(max, item.count), 0)

    // 月度热力：当年 12 个月 × 每月 4 周
    const year = new Date().getFullYear()
    const months = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      weeks: [0, 0, 0, 0],
      total: 0,
    }))
    list.forEach((entry) => {
      const date = new Date(entry.updatedAt || entry.createdAt || 0)
      if (date.getFullYear() !== year) return
      const week = Math.min(3, Math.floor((date.getDate() - 1) / 7))
      months[date.getMonth()].weeks[week] += 1
      months[date.getMonth()].total += 1
    })
    const heatMax = months.reduce(
      (max, month) => Math.max(max, ...month.weeks),
      0,
    )

    const myPosts = posts.value
    const likesReceived = myPosts.reduce((sum, post) => sum + (post.likedBy || []).length, 0)

    return {
      total: list.length,
      favorite: favoriteCount,
      watched: byStatus[STATUS.WATCHED],
      watching: byStatus[STATUS.WATCHING],
      want: byStatus[STATUS.WANT],
      hold: byStatus[STATUS.HOLD],
      drop: byStatus[STATUS.DROP],
      watchedEpisodes,
      watchedHours: Math.round((watchedEpisodes * MINUTES_PER_EPISODE) / 60),
      avgScore: scoredCount ? Math.round((scoreSum / scoredCount) * 100) / 100 : null,
      scoredCount,
      statusDistribution,
      scoreBuckets: buckets,
      scoreHigh: buckets[3].count,
      scoreMid: buckets[2].count,
      tagPreference,
      tagMax,
      months,
      heatMax,
      postCount: myPosts.length,
      likesReceived,
      year,
    }
  })

  return { stats, entries, posts }
}
