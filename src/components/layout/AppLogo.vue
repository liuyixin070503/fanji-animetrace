<!--
  品牌标（A 负责）：粉色 comic 方块 + 番迹字标，Header / 登录页 / 尾页共用
  size 控制整体高度，show-en 控制是否显示 ANIMETRACE 小字
-->
<script setup>
defineProps({
  size: { type: Number, default: 34 },
  showEn: { type: Boolean, default: false },
})
</script>

<template>
  <span class="logo" :style="{ '--logo-size': `${size}px` }">
    <span class="logo__mark">comic</span>
    <span class="logo__text">
      番迹
      <small v-if="showEn">ANIMETRACE</small>
    </span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: stretch;
  height: var(--logo-size);
  border: 2px solid var(--ink);
  border-radius: 6px;
  background: var(--paper-3);
  overflow: hidden;
  box-shadow: 2px 2px 0 rgba(27, 27, 27, 0.18);
  vertical-align: middle;
}

.logo__mark {
  display: grid;
  place-items: center;
  padding: 0 calc(var(--logo-size) * 0.2);
  background: var(--pink-deep);
  color: #fff;
  border-right: 2px solid var(--ink);
  font-family: var(--font-mono);
  font-size: calc(var(--logo-size) * 0.23);
  font-weight: 700;
}

.logo__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 calc(var(--logo-size) * 0.22);
  font-family: var(--font-display);
  font-size: calc(var(--logo-size) * 0.52);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--ink);
}

.logo__text small {
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: calc(var(--logo-size) * 0.16);
  letter-spacing: 0.16em;
  color: var(--ink-3);
}
</style>
