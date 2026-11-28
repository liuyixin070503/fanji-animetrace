<script setup>
/**
 * 新建 / 编辑手帐（C 负责）：同一个视图两种模式，靠 route.meta.mode 区分。
 * 两种参数：?animeId= 从番剧库导入（查重）；/journal/:id 直达编辑。
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as db from '../../data/db.js'
import { useToast } from '../../composables/useToast.js'
import { defaultJournalEntry } from '../../types/db.js'
import BaseButton from '../../components/ui/BaseButton.vue'
import BasePanel from '../../components/ui/BasePanel.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import JournalForm from '../../components/journal/JournalForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => route.meta.mode === 'edit')
const ready = ref(false)
const submitting = ref(false)
const entry = ref(null)
const anime = ref(null)
const animes = ref([])

function load() {
  const uid = db.currentUserId()
  animes.value = db.listAnime()

  if (isEdit.value) {
    const found = db.getJournal(route.params.id)
    if (!found) {
      toast.error('这条手帐不存在')
      ready.value = true
      return
    }
    entry.value = found
    anime.value = db.getAnime(found.animeId)
    ready.value = true
    return
  }

  const animeId = route.query.animeId
  if (animeId) {
    const target = db.getAnime(animeId)
    if (!target) {
      toast.error('没有找到这部番剧')
      ready.value = true
      return
    }
    // 查重：同一用户同一部番只保留一条（F11）
    const existing = db.getJournalByAnime(uid, animeId)
    if (existing) {
      toast.info('这部番已经在手帐里了，正在打开')
      router.replace(`/journal/${existing.id}`)
      return
    }
    anime.value = target
    entry.value = defaultJournalEntry({
      userId: uid,
      animeId,
      tags: (target.tags || []).slice(0, 3),
    })
    ready.value = true
    return
  }

  entry.value = defaultJournalEntry({
    userId: uid,
    tags: (animes.value[0]?.tags || []).slice(0, 3),
  })
  ready.value = true
}

function onSave(payload) {
  submitting.value = true
  try {
    const saved = db.saveJournal({ ...payload, userId: payload.userId || db.currentUserId() })
    toast.success(isEdit.value ? '已保存修改' : '手帐已建立')
    router.push(`/journal/${saved.id}`)
  } catch (error) {
    toast.error('保存失败：' + (error?.message || '请稍后重试'))
    submitting.value = false
  }
}

function cancel() {
  router.back()
}

onMounted(load)
</script>

<template>
  <main class="page">
    <BaseButton variant="ghost" @click="cancel">← 取消</BaseButton>

    <header class="head">
      <p class="eyebrow">{{ isEdit ? 'EDIT JOURNAL' : 'NEW JOURNAL' }}</p>
      <h1>{{ isEdit ? '编辑手帐' : '新建手帐' }}</h1>
      <p v-if="anime" class="lead">正在为「{{ anime.title }}」写记录</p>
      <p v-else class="lead">选一部番，留下这一次的观看记录。</p>
    </header>

    <EmptyState
      v-if="ready && !entry"
      title="找不到要编辑的手帐"
      description="它可能已经被删除了，或者链接里的 id 不对。"
      action-label="回手帐墙"
      @action="router.push('/journal')"
    />

    <div v-else-if="!ready" class="loading">正在准备表单…</div>

    <BasePanel v-else>
      <JournalForm
        :entry="entry"
        :anime="anime"
        :animes="animes"
        :user-id="entry.userId"
        :is-edit="isEdit"
        :submitting="submitting"
        @submit="onSave"
        @cancel="cancel"
      />
    </BasePanel>
  </main>
</template>

<style scoped>
.page {
  max-width: 840px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-5) var(--sp-8);
}
.head {
  margin: var(--sp-3) 0 var(--sp-5);
  padding: var(--sp-5) var(--sp-5);
  background: var(--pink-soft);
  border: var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hard-sm);
}
.eyebrow {
  margin: 0;
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
  color: var(--clay);
}
.head h1 {
  margin: var(--sp-2) 0;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
}
.lead {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--ink-2);
}
.loading {
  padding: var(--sp-7);
  text-align: center;
  color: var(--ink-3);
}
@media (max-width: 767px) {
  .page {
    padding: var(--sp-4) var(--sp-3) calc(var(--sp-8) + var(--tabbar-h));
  }
  .head {
    padding: var(--sp-4);
  }
  .head h1 {
    font-size: var(--fs-lg);
  }
}
</style>
