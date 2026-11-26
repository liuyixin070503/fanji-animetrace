<!-- 移动端底部 Tab（A 负责）：<768px 才出现，四个主入口 -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { label: '番剧库', path: '/library', icon: 'grid' },
  { label: '手帐', path: '/journal', icon: 'book' },
  { label: '论坛', path: '/forum', icon: 'chat' },
  { label: '我的', path: '/profile', icon: 'user' },
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const paths = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 3v18',
  chat: 'M4 5h16v11H9l-5 4z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
}
</script>

<template>
  <nav class="tabbar" aria-label="移动端主导航">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tabbar__item"
      :class="{ 'is-active': isActive(tab.path) }"
    >
      <svg class="tabbar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="paths[tab.icon]" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
      <span class="tabbar__label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  display: none;
}

@media (max-width: 767px) {
  .tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-tabbar);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--paper-3);
    border-top: var(--bw) solid var(--ink);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .tabbar__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: var(--tabbar-h);
    color: var(--ink-3);
    text-decoration: none;
    font-size: 11px;
    font-weight: 700;
  }

  .tabbar__icon {
    width: 22px;
    height: 22px;
  }

  .tabbar__item.is-active {
    color: var(--ink);
    background: var(--sun-soft);
    box-shadow: inset 0 3px 0 var(--coral);
  }
}
</style>
