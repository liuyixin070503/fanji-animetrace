<script setup>
// C · 手帐卡：只收 props / 抛事件，不读 store、不 import B 的海报卡。
import { computed, ref, watch } from 'vue'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import { formatDate, formatScore, progressText } from '../../utils/format.js'

const props = defineProps({
  entry: { type: Object, required: true },
  anime: { type: Object, default: null },
})
const emit = defineEmits(['open', 'edit', 'remove'])

const failed = ref(false)
watch(
  () => props.anime?.cover?.src,
  () => {
    failed.value = false
  }
)

// 用 id 哈希固定 ±2.5°，避免每次渲染跳动
const tilt = computed(() => {
  const id = String(props.entry.id || '')
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return `${((hash % 500) / 100 - 2.5).toFixed(2)}deg`
})

const title = computed(() => props.anime?.title || props.entry.title || '未命名')
const score = computed(() => formatScore(props.entry.score))
const date = computed(() => formatDate(props.entry.updatedAt || props.entry.createdAt))
const progress = computed(() => progressText(props.entry.progress, props.anime?.episodes))
</script>

<template>
  <article class="card" :style="{ transform: `rotate(${tilt})` }">
    <div class="tape" aria-hidden="true" />
    <header class="head">
      <div class="cover">
        <img
          v-if="anime?.cover?.src && !failed"
          :src="anime.cover.src"
          :alt="`${title} 海报`"
          loading="lazy"
          @error="failed = true"
        />
        <div v-else class="fallback">{{ title }}</div>
      </div>
      <div class="text">
        <BaseBadge :status="entry.status" size="sm" />
        <h3 :title="title">{{ title }}</h3>
        <p class="jp">{{ anime?.titleJp || '—' }}</p>
      </div>
    </header>

    <p class="review">{{ entry.review || '还没有写短评，点开补两句吧。' }}</p>

    <footer class="foot">
      <span>{{ progress }}</span>
      <span class="score" :class="{ empty: !entry.score }">我的评分 {{ entry.score ? score : '—' }}</span>
      <span>{{ date }}</span>
      <span v-if="entry.favorite" class="fav" aria-label="已收藏">★</span>
    </footer>

    <div class="actions">
      <BaseButton variant="soft" size="sm" @click.stop="emit('open', entry.id)">查看</BaseButton>
      <BaseButton variant="ghost" size="sm" @click.stop="emit('edit', entry.id)">编辑</BaseButton>
      <BaseButton variant="ghost" size="sm" @click.stop="emit('remove', entry)">删除</BaseButton>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  padding: var(--sp-5) var(--sp-4) var(--sp-3);
  background: var(--paper-3);
  border: var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hard);
  transition: box-shadow var(--dur-base) var(--ease);
}
.card:hover,
.card:focus-within {
  box-shadow: var(--shadow-hard-lg);
}
.tape {
  position: absolute;
  top: -12px;
  left: 50%;
  width: 96px;
  height: 28px;
  transform: translateX(-50%) rotate(-2deg);
  background: url('../../assets/journal/tape.svg') center / contain no-repeat;
  pointer-events: none;
}
.head {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: var(--sp-3);
  align-items: start;
}
.cover {
  width: 56px;
  height: 78px;
  overflow: hidden;
  border: 1px solid var(--ink);
  border-radius: var(--r-xs);
  background: var(--cream);
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fallback {
  display: grid;
  place-items: center;
  height: 100%;
  padding: var(--sp-1);
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  color: var(--ink-2);
  word-break: break-all;
}
.text {
  min-width: 0;
}
.text h3 {
  margin: var(--sp-2) 0 2px;
  font-family: var(--font-display);
  font-size: var(--fs-base);
  line-height: var(--lh-tight);
  overflow-wrap: anywhere;
  word-break: break-word;
}
.jp {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 评分放进页脚，字号收小，不再抢状态角标的视觉位置 */
.score {
  font-size: var(--fs-xs);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--ink-2);
}
.score.empty {
  color: var(--ink-3);
  font-weight: 400;
}
.review {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 60px;
  margin: var(--sp-4) 0 var(--sp-3);
  font-size: var(--fs-sm);
  line-height: var(--lh-base);
  color: var(--ink-2);
  white-space: pre-line;
}
.foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-1) var(--sp-2);
  padding-top: var(--sp-2);
  border-top: 1px dashed rgba(27, 27, 27, 0.25);
  font-size: var(--fs-xs);
  color: var(--ink-3);
}
.fav {
  margin-left: auto;
  color: var(--sun);
  -webkit-text-stroke: 1px var(--ink);
}
/* 三个按钮等宽铺满卡片内容区，窄屏也不会挤出边界 */
.actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}
.actions :deep(.btn) {
  width: 100%;
  border-color: var(--ink);
  box-shadow: var(--shadow-hard-sm);
}
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
@media (max-width: 767px) {
  .card {
    padding: var(--sp-4) var(--sp-3) var(--sp-2);
  }
  .head {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: var(--sp-2);
  }
  .cover {
    width: 44px;
    height: 62px;
  }
  .actions {
    gap: 4px;
  }
  .actions :deep(.btn) {
    padding: 6px 2px;
    font-size: 12px;
  }
}
</style>
