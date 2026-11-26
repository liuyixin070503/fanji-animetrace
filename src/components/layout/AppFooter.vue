<!-- 尾页（A 负责）：整幅纸色带 + 品牌 / 标语 / 四项导航 / 版本行 -->
<script setup>
import AppLogo from './AppLogo.vue'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <RouterLink to="/library" class="footer__logo" aria-label="番迹 AnimeTrace 首页">
        <AppLogo :size="44" show-en />
      </RouterLink>

      <p class="footer__tagline">把喜欢的动画，贴进自己的手帐。</p>

      <nav class="footer__nav" aria-label="页脚导航">
        <RouterLink to="/library">番剧库</RouterLink>
        <RouterLink to="/journal">手帐</RouterLink>
        <RouterLink to="/forum">论坛</RouterLink>
        <RouterLink to="/profile">个人中心</RouterLink>
      </nav>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--sp-8);
  background: var(--paper);
  border-top: var(--bw) solid var(--ink);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  padding-top: var(--sp-5);
  padding-bottom: var(--sp-7);
  text-align: center;
}

.footer__inner::before {
  content: '';
  width: 100%;
  border-top: 2px dashed rgba(27, 27, 27, 0.25);
  margin-bottom: var(--sp-4);
}

.footer__logo {
  text-decoration: none;
}

.footer__tagline {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--sp-4);
  font-size: var(--fs-sm);
  font-weight: 700;
}

.footer__nav a {
  color: var(--ink-2);
  text-decoration: none;
}

.footer__nav a:hover {
  color: var(--coral-deep);
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 767px) {
  .footer {
    margin-top: var(--sp-6);
    padding-bottom: var(--tabbar-h);
  }
}
</style>
