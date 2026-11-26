<!--
  应用外壳（A 负责）
  - 普通页面：Header + <RouterView> + Footer + 移动端 TabBar + Toast
  - meta.layout === 'blank'（登录/注册）：只有全屏内容，不渲染导航
-->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import MobileTabBar from './components/layout/MobileTabBar.vue'
import ToastHost from './components/ui/ToastHost.vue'

const route = useRoute()
const isBlank = computed(() => route.meta.layout === 'blank')
</script>

<template>
  <div class="app" :class="{ 'app--blank': isBlank }">
    <div class="app-bg" aria-hidden="true"></div>
    <AppHeader v-if="!isBlank" />

    <main class="app__main">
      <RouterView v-slot="{ Component, route: current }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="current.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter v-if="!isBlank" />
    <MobileTabBar v-if="!isBlank" />
    <ToastHost />
  </div>
</template>
