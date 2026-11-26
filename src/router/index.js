/**
 * 路由总装：只做三件事
 *   1. 用 import.meta.glob 自动收集 modules/ 下的路由表（加页面不用动这个文件）
 *   2. 全局守卫：未登录 → /login?redirect=...；已登录访问 /login → /library
 *   3. 标题、滚动行为
 *
 * 只有 A 改这个文件。B/C/D/E 要加页面，在自己的 modules/xxx.js 里加一条。
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { useSessionStore } from '../stores/session.js'

const modules = import.meta.glob('./modules/*.js', { eager: true })

const generated = Object.keys(modules)
  .sort()
  .flatMap((key) => modules[key].routes || [])

export const routes = [
  { path: '/', redirect: '/library' },
  ...generated,
  // 未知地址统一回番剧库，不留在白屏
  { path: '/:pathMatch(.*)*', redirect: '/library' },
]

const router = createRouter({
  // hash 模式：GitHub Pages 刷新 404 问题直接消失
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const session = useSessionStore()
  session.restore()

  if (to.meta.requiresAuth && !session.isLoggedIn) {
    // 带上原地址，登录后原地回跳（验收项：登录成功回到来源页）
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && session.isLoggedIn) {
    return { path: '/library' }
  }
  return true
})

router.afterEach((to) => {
  const base = '番迹 AnimeTrace'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
