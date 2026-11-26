/**
 * Pinia 只存"登录态"这一件事（项目说明的技术约束）。
 * 业务数据一律在页面里调 db.js，不要往 store 里塞手帐/帖子。
 */
import { defineStore } from 'pinia'
import * as db from '../data/db.js'

export const useSessionStore = defineStore('session', {
  state: () => ({
    /** @type {import('../types/db.js').User|null} */
    user: null,
    /** 是否已经从 localStorage 恢复过一次（守卫靠它避免重复读） */
    restored: false,
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    userId: (state) => (state.user ? state.user.id : ''),
    nickname: (state) => (state.user ? state.user.nickname : ''),
    avatarSeed: (state) => (state.user ? state.user.avatarSeed : '#FFD84D'),
  },

  actions: {
    /** 刷新页面后把会话捞回来（守卫在每次导航前调用，幂等） */
    restore() {
      if (this.restored) return this.user
      this.user = db.getSession()
      this.restored = true
      return this.user
    },

    /** 同步库里的用户资料（改了昵称之后调一下） */
    sync() {
      this.user = db.getSession()
      return this.user
    },

    /** @param {{username:string, password:string, remember:boolean}} payload */
    signIn(payload) {
      const result = db.login(payload.username, payload.password, payload.remember)
      if (result.ok) this.user = result.user
      return result
    },

    /** @param {{username:string, nickname:string, password:string}} payload */
    signUp(payload) {
      const result = db.register(payload)
      if (result.ok) this.user = result.user
      return result
    },

    signOut() {
      db.logout()
      this.user = null
      this.restored = true
    },
  },
})
