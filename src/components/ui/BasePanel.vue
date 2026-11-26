<!--
  纸卡片容器（A 负责）
  白底 + 2px 墨黑 + 4px 硬投影，全站所有"一块内容"都用它包，
  这样卡片阴影不会五个页面各画一套。
-->
<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** paper(默认) / flat(无投影，用于嵌套) / ink(墨黑反白) */
  tone: { type: String, default: 'paper' },
  /** 内容区是否带内边距 */
  padded: { type: Boolean, default: true },
})
</script>

<template>
  <section class="panel" :class="[`panel--${tone}`, { 'panel--padded': padded }]">
    <header v-if="title || $slots.header || $slots.actions" class="panel__head">
      <slot name="header">
        <div class="panel__titles">
          <h2 class="panel__title">{{ title }}</h2>
          <p v-if="subtitle" class="panel__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="panel__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="panel__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="panel__foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  background: var(--paper-3);
  border: var(--bw) solid var(--ink);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hard);
  min-width: 0;
}

.panel--flat {
  box-shadow: var(--shadow-hard-sm);
}

.panel--ink {
  background: var(--ink);
  color: var(--paper);
}

.panel--ink :deep(a) {
  color: var(--sun);
}

.panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-4) 0;
}

.panel__titles {
  min-width: 0;
}

.panel__title {
  font-size: var(--fs-md);
  font-weight: 800;
  letter-spacing: 0.01em;
}

.panel__subtitle {
  margin-top: 2px;
  font-size: var(--fs-xs);
  color: var(--ink-3);
}

.panel--ink .panel__subtitle {
  color: rgba(251, 246, 236, 0.65);
}

.panel__body {
  flex: 1;
  min-width: 0;
}

.panel--padded .panel__body {
  padding: var(--sp-4);
}

.panel__foot {
  border-top: 2px dashed rgba(27, 27, 27, 0.2);
  padding: var(--sp-3) var(--sp-4);
}

.panel--ink .panel__foot {
  border-color: rgba(251, 246, 236, 0.2);
}
</style>
