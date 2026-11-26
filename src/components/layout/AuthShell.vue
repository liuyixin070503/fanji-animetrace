<!--
  登录 / 注册的整屏外壳（A 负责）
  左侧珊瑚品牌区（标题 + 引文 + 三条卖点 + 结语 + 底部海报条），
  右侧樱花背景上浮一张表单卡。
  mode: login / register，只影响 tab 高亮。
-->
<script setup>
import AppLogo from './AppLogo.vue'

defineProps({
  mode: { type: String, default: 'login' },
})

const points = [
  { no: '01', text: '可按标签、年份、观看状态检索作品' },
  { no: '02', text: '一部番一页手帐，状态 / 进度 / 评分 / 短评' },
  { no: '03', text: '个人中心自动生成你的观看画像' },
]

const covers = [
  './covers/a001.jpg',
  './covers/a002.jpg',
  './covers/a003.jpg',
  './covers/a004.jpg',
  './covers/a006.jpg',
]
</script>

<template>
  <div class="auth">
    <aside class="auth__brand">
      <AppLogo :size="38" class="auth__logo" />

      <h1 class="auth__title">
        <span class="auth__title-line">把喜欢的</span>
        <span class="auth__title-em">动画</span>
        <span class="auth__title-line">贴进自己的手帐</span>
      </h1>

      <p class="auth__lead">
        别人给你打分，这里只记录你自己的那一份：<br />
        看到第几集、当时在想什么、哪句台词戳中了你。
      </p>

      <ol class="auth__points">
        <li v-for="point in points" :key="point.no" class="auth__point">
          <span class="auth__point-no">{{ point.no }}</span>
          <span>{{ point.text }}</span>
        </li>
      </ol>

      <p class="auth__note">
        评分、标签、长评、海报墙——这里没有无聊的工作台，只有属于你的动画收藏宇宙。
      </p>

      <div class="auth__strip" aria-hidden="true">
        <img v-for="cover in covers" :key="cover" :src="cover" alt="" />
      </div>
    </aside>

    <main class="auth__panel">
      <div class="auth__card">
        <div class="auth__tabs">
          <RouterLink to="/login" class="auth__tab" :class="{ 'is-active': mode === 'login' }">
            登录
          </RouterLink>
          <RouterLink to="/register" class="auth__tab" :class="{ 'is-active': mode === 'register' }">
            注册
          </RouterLink>
        </div>

        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth {
  display: grid;
  grid-template-columns: minmax(0, 0.62fr) minmax(0, 0.78fr);
  width: 100%;
  min-height: 100dvh;
}

/* ---- 左侧品牌区 ---- */
.auth__brand {
  position: relative;
  overflow: hidden;
  background-color: var(--coral);
  background-image: repeating-linear-gradient(
    90deg,
    rgba(27, 27, 27, 0.07) 0 1px,
    transparent 1px 16px
  );
  border-right: var(--bw) solid var(--ink);
  padding: var(--sp-6) var(--sp-6) 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-4);
}

.auth__logo {
  margin-bottom: var(--sp-3);
}

.auth__title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: var(--font-display);
  line-height: 0.98;
  letter-spacing: 0.02em;
}

.auth__title-line {
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 800;
  color: var(--ink);
}

.auth__title-em {
  margin: 3px 0 3px;
  padding: 0 6px 2px;
  font-size: clamp(36px, 4.2vw, 58px);
  font-weight: 800;
  color: var(--sun);
  border-bottom: 4px solid var(--ink);
}

.auth__lead {
  max-width: 40ch;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  box-shadow: var(--shadow-hard);
  padding: var(--sp-3) var(--sp-4);
  font-size: var(--fs-sm);
  line-height: 1.6;
}

.auth__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
}

.auth__point {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  box-shadow: var(--shadow-hard-sm);
  padding: 4px 10px;
  font-size: var(--fs-sm);
  font-weight: 600;
}

.auth__point-no {
  flex: none;
  width: 26px;
  height: 20px;
  display: grid;
  place-items: center;
  background: var(--sun);
  border: 1.5px solid var(--ink);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
}

.auth__note {
  max-width: 34ch;
  padding-left: var(--sp-4);
  border-left: 4px solid var(--ink);
  font-size: var(--fs-sm);
  line-height: 1.55;
  color: var(--ink-2);
}

/* 海报条：贴在品牌区底部，被下沿裁掉一截 */
.auth__strip {
  position: absolute;
  left: -8px;
  right: -8px;
  bottom: -44px;
  display: flex;
  gap: 8px;
  padding: 0 var(--sp-4);
  pointer-events: none;
}

.auth__strip img {
  width: 19%;
  aspect-ratio: 5 / 7;
  object-fit: cover;
  border: 2px solid var(--ink);
  box-shadow: 3px 3px 0 rgba(27, 27, 27, 0.35);
}

.auth__strip img:nth-child(1) {
  transform: rotate(-4deg) translateY(8px);
}

.auth__strip img:nth-child(2) {
  transform: rotate(2deg) translateY(-6px);
}

.auth__strip img:nth-child(3) {
  transform: rotate(-1.5deg) translateY(12px);
}

.auth__strip img:nth-child(4) {
  transform: rotate(4deg) translateY(-4px);
}

.auth__strip img:nth-child(5) {
  transform: rotate(-2.5deg) translateY(10px);
}

/* ---- 右侧表单区：樱花照片 + 纸色薄纱 ---- */
.auth__panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-6) var(--sp-4);
  background-color: var(--paper);
  background-image: var(--bg-photo);
  background-position: 18% center;
  background-size: cover;
  background-repeat: no-repeat;
}

.auth__panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(251, 246, 236, var(--veil));
  pointer-events: none;
}

.auth__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--auth-max);
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  box-shadow: var(--shadow-hard-lg);
  border-radius: var(--r-md);
  padding: var(--sp-5);
}

.auth__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-xs);
  overflow: hidden;
  margin-bottom: var(--sp-5);
}

.auth__tab {
  padding: 9px 0;
  text-align: center;
  font-weight: 700;
  font-size: var(--fs-sm);
  color: var(--ink-2);
  text-decoration: none;
  background: var(--paper-3);
}

.auth__tab + .auth__tab {
  border-left: var(--bw) solid var(--ink);
}

.auth__tab.is-active {
  background: var(--sun);
  color: var(--ink);
}

@media (max-height: 820px) and (min-width: 961px) {
  .auth__brand {
    padding-bottom: var(--sp-6);
  }

  .auth__strip {
    display: none;
  }
}

@media (max-width: 960px) {
  .auth {
    grid-template-columns: 1fr;
  }

  .auth__brand {
    border-right: none;
    border-bottom: var(--bw) solid var(--ink);
    padding: var(--sp-5) var(--sp-4) var(--sp-6);
    gap: var(--sp-3);
  }

  .auth__title-line {
    font-size: 30px;
  }

  .auth__title-em {
    font-size: 38px;
  }

  .auth__note,
  .auth__strip {
    display: none;
  }

  .auth__panel {
    align-items: flex-start;
    padding: var(--sp-5) var(--sp-4) var(--sp-7);
  }

  .auth__panel::after {
    background: rgba(251, 246, 236, calc(var(--veil) + 0.25));
  }
}
</style>
