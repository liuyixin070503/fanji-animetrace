<!--
  顶部导航（A 负责）
  桌面：logo + 三个主入口 + 搜索 + 头像菜单
  移动：只留 logo + 头像，导航交给 MobileTabBar
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session.js'
import { useToast } from '../../composables/useToast.js'
import * as db from '../../data/db.js'
import { initialOf } from '../../utils/format.js'
import ConfirmDialog from '../ui/ConfirmDialog.vue'
import AppLogo from './AppLogo.vue'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const toast = useToast()

const menuOpen = ref(false)
const resetOpen = ref(false)
const keyword = ref('')

const navs = [
  { label: '番剧库', path: '/library' },
  { label: '手帐', path: '/journal' },
  { label: '论坛', path: '/forum' },
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const avatarColor = computed(() => session.avatarSeed || '#FFD84D')
const initial = computed(() => initialOf(session.nickname))

function submitSearch() {
  const q = keyword.value.trim()
  router.push({ path: '/library', query: q ? { q } : {} })
}

function goProfile() {
  menuOpen.value = false
  router.push('/profile')
}

function askReset() {
  menuOpen.value = false
  resetOpen.value = true
}

function doReset() {
  db.resetAll()
  session.signOut()
  resetOpen.value = false
  toast.success('演示数据已重置，请重新登录')
  router.replace('/login')
}

function signOut() {
  menuOpen.value = false
  session.signOut()
  toast.info('已退出登录')
  router.replace('/login')
}

function onDocumentClick(event) {
  if (!event.target.closest('.header__menu-wrap')) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <RouterLink to="/library" class="header__logo" aria-label="番迹 AnimeTrace 首页">
        <AppLogo :size="34" />
      </RouterLink>

      <nav class="header__nav" aria-label="主导航">
        <RouterLink
          v-for="item in navs"
          :key="item.path"
          :to="item.path"
          class="header__link"
          :class="{ 'is-active': isActive(item.path) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <form class="header__search" role="search" @submit.prevent="submitSearch">
        <span class="header__search-icon" aria-hidden="true">⌕</span>
        <input
          v-model="keyword"
          class="header__search-input"
          type="search"
          placeholder="搜番名 / 日文名…"
          aria-label="搜索番剧"
        />
      </form>

      <div class="header__menu-wrap">
        <button
          type="button"
          class="header__avatar"
          :style="{ background: avatarColor }"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          :aria-label="`账号菜单：${session.nickname}`"
          @click.stop="menuOpen = !menuOpen"
        >
          {{ initial }}
        </button>

        <Transition name="fade">
          <div v-if="menuOpen" class="header__menu" role="menu">
            <p class="header__menu-user">
              {{ session.nickname }}
              <span class="muted small">@{{ session.user ? session.user.username : '' }}</span>
            </p>
            <button type="button" class="header__menu-item" role="menuitem" @click="goProfile">
              个人中心
            </button>
            <button type="button" class="header__menu-item" role="menuitem" @click="askReset">
              重置演示数据
            </button>
            <button type="button" class="header__menu-item is-danger" role="menuitem" @click="signOut">
              退出登录
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <ConfirmDialog
      v-model="resetOpen"
      title="重置演示数据？"
      message="会清空所有手帐、帖子、评论和账号，恢复到初始的 10 部番 / 3 个演示账号。"
      confirm-text="清空并重置"
      danger
      @confirm="doReset"
    />
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: rgba(251, 246, 236, 0.94);
  backdrop-filter: blur(6px);
  border-bottom: var(--bw) solid var(--ink);
}

.header__inner {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: var(--sp-5);
}

.header__logo {
  display: flex;
  align-items: center;
  flex: none;
  text-decoration: none;
  transition: transform var(--dur-fast) var(--ease);
}

.header__logo:hover {
  transform: translate(-1px, -1px);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.header__link {
  padding: 6px 14px;
  border: 2px solid transparent;
  border-radius: var(--r-sm);
  color: var(--ink-2);
  font-weight: 700;
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease);
}

.header__link:hover {
  background: rgba(27, 27, 27, 0.06);
  color: var(--ink);
}

.header__link.is-active {
  background: var(--sun);
  border-color: var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
  color: var(--ink);
}

.header__search {
  flex: 1;
  max-width: 320px;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--paper-3);
  border: 2px solid var(--ink);
  border-radius: var(--r-pill);
  padding: 4px 12px;
}

.header__search:focus-within {
  box-shadow: 2px 2px 0 var(--coral);
}

.header__search-icon {
  font-size: 16px;
  color: var(--ink-3);
}

.header__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 4px 0;
  font-size: var(--fs-sm);
}

.header__menu-wrap {
  position: relative;
  flex: none;
}

.header__avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 2px solid var(--ink);
  border-radius: 50%;
  box-shadow: 2px 2px 0 var(--ink);
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink);
}

.header__avatar:hover {
  transform: translate(-1px, -1px);
}

.header__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  z-index: var(--z-dropdown);
  width: 200px;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-hard);
  padding: var(--sp-2);
}

.header__menu-user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px 8px;
  border-bottom: 2px dashed rgba(27, 27, 27, 0.16);
  font-weight: 700;
  margin-bottom: var(--sp-1);
}

.header__menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px;
  border-radius: var(--r-xs);
  font-size: var(--fs-sm);
}

.header__menu-item:hover {
  background: var(--paper-2);
}

.header__menu-item.is-danger {
  color: var(--danger);
}

@media (max-width: 900px) {
  .header__search {
    display: none;
  }
}

@media (max-width: 767px) {
  .header__nav {
    display: none;
  }
  .header__inner {
    gap: var(--sp-3);
    justify-content: space-between;
  }
}
</style>
