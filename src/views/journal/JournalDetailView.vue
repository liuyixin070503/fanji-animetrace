<script setup>
/** 手帐详情（C 负责）：/journal/:id 可直达可刷新；删除走 ConfirmDialog。 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as db from '../../data/db.js'
import { useToast } from '../../composables/useToast.js'
import { formatDate, formatScore, progressText } from '../../utils/format.js'
import BaseBadge from '../../components/ui/BaseBadge.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import BasePanel from '../../components/ui/BasePanel.vue'
import BaseTag from '../../components/ui/BaseTag.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import EmptyState from '../../components/ui/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const entry = ref(null)
const anime = ref(null)
const showConfirm = ref(false)

const score = computed(() => formatScore(entry.value?.score))
const episodes = computed(() => Number(anime.value?.episodes) || 0)
const progress = computed(() => progressText(entry.value?.progress, episodes.value))
const percent = computed(() =>
  episodes.value ? Math.min(100, ((Number(entry.value?.progress) || 0) / episodes.value) * 100) : 0
)
const mood = computed(() => entry.value?.mood || [])
const tags = computed(() => entry.value?.tags || [])
const updated = computed(() => formatDate(entry.value?.updatedAt || entry.value?.createdAt))

function goEdit() {
  router.push({ name: 'journal-edit', params: { id: entry.value.id } })
}
function doRemove() {
  db.removeJournal(entry.value.id)
  toast.success('已删除这条手帐')
  showConfirm.value = false
  router.replace('/journal')
}

onMounted(() => {
  const found = db.getJournal(route.params.id)
  if (!found) return
  entry.value = found
  anime.value = db.getAnime(found.animeId)
})
</script>

<template>
  <main class="page">
    <BaseButton variant="ghost" @click="router.push('/journal')">← 返回手帐墙</BaseButton>

    <EmptyState
      v-if="!entry"
      title="找不到这条手帐"
      description="它可能已经被删除了，或者链接里的 id 不对。"
      action-label="回手帐墙"
      @action="router.push('/journal')"
    />

    <BasePanel v-else class="sheet">
      <div class="tape" aria-hidden="true" />
      <header class="head">
        <div class="cover">
          <img
            v-if="anime?.cover?.src"
            :src="anime.cover.src"
            :alt="`${anime.title} 海报`"
            @error="$event.target.style.display = 'none'"
          />
          <div class="fallback">{{ anime?.title || '未关联番剧' }}</div>
        </div>
        <div class="info">
          <BaseBadge :status="entry.status" />
          <h1>{{ anime?.title || '未命名手帐' }}</h1>
          <p class="jp">{{ anime?.titleJp || '—' }}</p>
          <p class="meta">
            {{ anime?.year || '—' }} · {{ anime?.type || '—' }} · {{ anime?.episodes || '?' }} 集 ·
            {{ anime?.studio || '—' }}
          </p>
        </div>
        <div class="score-box">
          <strong :class="{ empty: !entry.score }">{{ score }}</strong>
          <span>我的评分</span>
        </div>
      </header>

      <section class="block">
        <h2>观看进度</h2>
        <div class="bar" role="img" :aria-label="progress">
          <span :style="{ width: `${percent}%` }" />
        </div>
        <p class="progress-text">{{ progress }}</p>
        <p v-if="entry.favorite" class="fav">★ 已收藏</p>
      </section>

      <section v-if="entry.review" class="block">
        <h2>短评</h2>
        <p class="review">{{ entry.review }}</p>
      </section>

      <blockquote v-if="entry.quote" class="quote">“{{ entry.quote }}”</blockquote>

      <section v-if="mood.length || tags.length" class="block">
        <h2>标签</h2>
        <div class="chips">
          <BaseTag v-for="item in mood" :key="`m-${item}`" label="" tone="pink" size="sm">
            {{ item }}
          </BaseTag>
          <BaseTag v-for="item in tags" :key="`t-${item}`" label="" tone="lilac" size="sm">
            {{ item }}
          </BaseTag>
        </div>
      </section>

      <footer class="foot">
        <span>更新于 {{ updated }}</span>
        <div class="actions">
          <BaseButton variant="coral" size="sm" @click="goEdit">编辑</BaseButton>
          <BaseButton variant="danger" size="sm" @click="showConfirm = true">删除</BaseButton>
        </div>
      </footer>
    </BasePanel>

    <ConfirmDialog
      v-model="showConfirm"
      title="删除这条手帐？"
      message="删除后无法恢复，确定继续吗？"
      confirm-text="确认删除"
      danger
      @confirm="doRemove"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-5) var(--sp-8);
}
.sheet {
  position: relative;
  margin-top: var(--sp-4);
}
.tape {
  position: absolute;
  top: -13px;
  left: var(--sp-6);
  width: 110px;
  height: 30px;
  transform: rotate(-3deg);
  background: url('../../assets/journal/tape.svg') center / contain no-repeat;
  pointer-events: none;
}
.head {
  display: grid;
  grid-template-columns: 118px 1fr auto;
  gap: var(--sp-5);
  align-items: start;
}
.cover {
  position: relative;
  width: 118px;
  height: 166px;
  border: var(--border);
  border-radius: var(--r-xs);
  overflow: hidden;
  background: var(--cream);
}
.cover img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--sp-2);
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--ink-2);
}
.info h1 {
  margin: var(--sp-2) 0 2px;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
}
.jp {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--ink-3);
}
.meta {
  margin: var(--sp-3) 0 0;
  font-size: var(--fs-sm);
  color: var(--ink-2);
}
.score-box {
  text-align: right;
}
.score-box strong {
  display: block;
  font-family: var(--font-display);
  font-size: 38px;
  color: var(--coral-deep);
}
.score-box strong.empty {
  color: var(--ink-3);
}
.score-box span {
  font-size: var(--fs-xs);
  color: var(--ink-3);
}
.block {
  margin-top: var(--sp-6);
}
.block h2 {
  margin: 0 0 var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--ink-2);
}
.bar {
  height: 10px;
  border: var(--border);
  border-radius: var(--r-pill);
  background: var(--paper-2);
  overflow: hidden;
}
.bar span {
  display: block;
  height: 100%;
  background: var(--coral);
}
.progress-text,
.fav {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-sm);
  color: var(--ink-2);
}
.review {
  margin: 0;
  font-size: var(--fs-base);
  line-height: var(--lh-base);
  white-space: pre-line;
}
.quote {
  margin: var(--sp-5) 0 0;
  padding: var(--sp-4) var(--sp-5);
  border-left: 4px solid var(--coral);
  background: var(--coral-soft);
  font-family: var(--font-display);
  font-size: var(--fs-base);
  line-height: var(--lh-base);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
  padding-top: var(--sp-3);
  border-top: 1px dashed rgba(27, 27, 27, 0.25);
  font-size: var(--fs-xs);
  color: var(--ink-3);
}
.actions {
  display: flex;
  gap: var(--sp-2);
}
@media (max-width: 767px) {
  .page {
    padding: var(--sp-4) var(--sp-3) calc(var(--sp-8) + var(--tabbar-h));
  }
  .head {
    grid-template-columns: 78px 1fr;
    gap: var(--sp-3);
  }
  .cover {
    width: 78px;
    height: 110px;
  }
  .info h1 {
    font-size: var(--fs-lg);
  }
  .score-box {
    grid-column: 1 / -1;
    text-align: left;
  }
  .score-box strong {
    font-size: 28px;
  }
}
</style>
