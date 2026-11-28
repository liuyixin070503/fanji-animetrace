<script setup>
/** 我的手帐（C 负责）：墙 + 状态 tab 计数 + 排序 + 空状态 + 删除二次确认。 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as db from '../../data/db.js'
import { useStats } from '../../composables/useStats.js'
import { useToast } from '../../composables/useToast.js'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseSelect from '../../components/ui/BaseSelect.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import SkeletonBlock from '../../components/ui/SkeletonBlock.vue'
import JournalWall from '../../components/journal/JournalWall.vue'
import StatusTabs from '../../components/journal/StatusTabs.vue'

const router = useRouter()
const toast = useToast()
const { stats, entries } = useStats()

const animeMap = Object.fromEntries(db.listAnime().map((item) => [item.id, item]))
const loading = ref(true)
const activeStatus = ref('全部')
const sort = ref('updated')
const showConfirm = ref(false)
const target = ref(null)

const tabs = computed(() =>
  stats.value.statusDistribution.map((item) => ({
    value: item.status,
    label: item.label,
    count: item.count,
  }))
)

const visibleEntries = computed(() => {
  const list =
    activeStatus.value === '全部'
      ? entries.value
      : entries.value.filter((item) => item.status === activeStatus.value)
  if (sort.value === 'score') {
    return [...list].sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  }
  return list
})

const confirmMessage = computed(
  () => `「${animeMap[target.value?.animeId]?.title || '未命名番剧'}」的记录会被移除，此操作不可撤销。`
)

function open(id) {
  router.push({ name: 'journal-detail', params: { id } })
}
function edit(id) {
  router.push({ name: 'journal-edit', params: { id } })
}
function askRemove(entry) {
  target.value = entry
  showConfirm.value = true
}
function doRemove() {
  if (!target.value) return
  db.removeJournal(target.value.id)
  toast.success('已删除这条手帐')
  showConfirm.value = false
  target.value = null
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 260)
})
</script>

<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">PRIVATE ARCHIVE</p>
        <h1>我的手帐</h1>
        <p class="lead">一部番一页，把看过的留下。</p>
      </div>
      <div class="hero-actions">
        <BaseButton variant="coral" @click="router.push('/library')">＋ 从番剧库导入</BaseButton>
        <BaseButton variant="soft" @click="router.push('/journal/new')">手动新建</BaseButton>
      </div>
    </header>

    <div class="toolbar">
      <StatusTabs v-model="activeStatus" :items="tabs" :total="stats.total" />
      <BaseSelect
        v-model="sort"
        :options="[
          { value: 'updated', label: '最近更新' },
          { value: 'score', label: '评分从高到低' },
        ]"
        size="sm"
      />
    </div>

    <div v-if="loading" class="skeleton-grid" aria-label="加载中">
      <div v-for="n in 6" :key="n" class="skeleton-item">
        <SkeletonBlock height="110px" radius="var(--r-md)" />
        <SkeletonBlock :lines="3" />
      </div>
    </div>

    <EmptyState
      v-else-if="stats.total === 0"
      title="手帐还是空的"
      description="先去番剧库挑一部，建立第一条记录。"
      action-label="去番剧库挑一部"
      @action="router.push('/library')"
    />

    <EmptyState
      v-else-if="visibleEntries.length === 0"
      :title="`「${activeStatus}」下还没有条目`"
      description="换个状态看看，或者回到全部。"
      action-label="查看全部"
      @action="activeStatus = '全部'"
    />

    <JournalWall
      v-else
      :entries="visibleEntries"
      :anime-map="animeMap"
      @open="open"
      @edit="edit"
      @remove="askRemove"
    />

    <ConfirmDialog
      v-model="showConfirm"
      title="删除这条手帐？"
      :message="confirmMessage"
      confirm-text="确认删除"
      danger
      @confirm="doRemove"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: var(--container);
  margin: 0 auto;
  padding: var(--sp-7) var(--sp-5) var(--sp-8);
}
.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-5);
  padding: var(--sp-5) var(--sp-6);
  background: var(--lilac-soft);
  border: var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hard);
}
.eyebrow {
  margin: 0;
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
  color: var(--clay);
}
h1 {
  margin: var(--sp-2) 0;
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
}
.lead {
  margin: 0;
  color: var(--ink-2);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
}
.toolbar :deep(.status-tabs) {
  margin-bottom: var(--sp-4);
}
.toolbar :deep(.field) {
  width: 180px;
}
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: var(--sp-6) var(--sp-5);
  padding-top: var(--sp-4);
}
.skeleton-item {
  display: grid;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: var(--border);
  border-radius: var(--r-md);
  background: var(--paper-3);
}
@media (max-width: 767px) {
  .page {
    padding: var(--sp-5) var(--sp-3) calc(var(--sp-8) + var(--tabbar-h));
  }
  .hero {
    padding: var(--sp-4);
  }
  h1 {
    font-size: var(--fs-xl);
  }
  .toolbar {
    flex-direction: column;
  }
  .toolbar :deep(.field) {
    width: 100%;
  }
}
</style>
