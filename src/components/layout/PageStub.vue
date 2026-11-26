<!--
  占位页（A 负责，仅 M1 阶段使用）
  B/C/D/E 各自把对应 view 文件整体替换掉即可，这个组件之后可以删。
  目的：11-26 那天全组拉下来 npm run dev，点每个导航都能看到"这页归谁、要做什么"。
-->
<script setup>
defineProps({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  tone: { type: String, default: 'paper' },
  accept: { type: String, default: '' },
  todos: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="container page">
    <header class="hero-band" :class="`hero-band--${tone}`">
      <p class="stub__crumb">番迹 AnimeTrace / 施工中</p>
      <h1 class="title-card stub__title">{{ title }}</h1>
      <p class="stub__owner">
        这一页由 <strong>{{ owner }}</strong> 负责，A 已经把路由、布局、样式变量和公共组件备好。
      </p>
    </header>

    <section class="paper stub__body">
      <h2 class="stub__subtitle">接手清单</h2>
      <p v-if="accept" class="stub__accept">对应验收项：{{ accept }}</p>
      <ul class="stub__list">
        <li v-for="todo in todos" :key="todo">{{ todo }}</li>
      </ul>
      <p class="stub__note">
        替换 <code>src/views/</code> 下这个页面对应的 .vue 文件即可，不要改 <code>data/</code>、
        <code>types/</code>、<code>styles/</code>、<code>components/ui/</code>。需要新数据字段先在群里说。
      </p>
    </section>
  </div>
</template>

<style scoped>
.stub__crumb {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: var(--sp-3);
}

.stub__title {
  font-family: var(--font-display);
}

.stub__owner {
  margin-top: var(--sp-4);
  max-width: 52ch;
  font-size: var(--fs-sm);
  background: var(--paper-3);
  border: 2px solid var(--ink);
  padding: var(--sp-2) var(--sp-3);
}

.stub__body {
  margin-top: var(--sp-5);
  padding: var(--sp-5);
}

.stub__subtitle {
  font-size: var(--fs-lg);
  font-family: var(--font-display);
}

.stub__accept {
  margin-top: var(--sp-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--coral-deep);
}

.stub__list {
  margin-top: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  font-size: var(--fs-sm);
}

.stub__note {
  margin-top: var(--sp-4);
  padding-top: var(--sp-3);
  border-top: 2px dashed rgba(27, 27, 27, 0.2);
  font-size: var(--fs-xs);
  color: var(--ink-3);
  line-height: 1.8;
}

.stub__note code {
  font-family: var(--font-mono);
  background: var(--paper-2);
  padding: 1px 4px;
}
</style>
