<script setup>
// C · 手帐表单：新建 / 编辑共用，组件不碰 db.js，只把整理好的 entry 抛给视图。
import { computed, reactive, watch } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseTag from '../ui/BaseTag.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import RatingInput from './RatingInput.vue'
import { MOODS, STATUS_LIST, STATUS } from '../../types/db.js'

const props = defineProps({
  entry: { type: Object, default: () => ({}) },
  anime: { type: Object, default: null },
  animes: { type: Array, default: () => [] },
  userId: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])

const errors = reactive({})
const draft = reactive({
  id: props.entry.id || '',
  userId: props.userId || props.entry.userId || '',
  animeId: props.anime?.id || props.entry.animeId || props.animes[0]?.id || '',
  status: props.entry.status || STATUS.WANT,
  progress: props.entry.progress ?? 0,
  score: props.entry.score ?? null,
  favorite: Boolean(props.entry.favorite),
  review: props.entry.review || '',
  quote: props.entry.quote || '',
  mood: Array.isArray(props.entry.mood) ? [...props.entry.mood] : [],
  tags: Array.isArray(props.entry.tags) ? [...props.entry.tags] : [],
  createdAt: props.entry.createdAt || 0,
  startedAt: props.entry.startedAt || null,
  finishedAt: props.entry.finishedAt || null,
})

const animeOptions = computed(() =>
  props.animes.map((item) => ({ value: item.id, label: item.title }))
)
const selectedAnime = computed(
  () => props.animes.find((item) => item.id === draft.animeId) || props.anime || null
)
const episodes = computed(() => Number(selectedAnime.value?.episodes) || 0)
const percent = computed(() =>
  episodes.value ? Math.min(100, (Number(draft.progress) / episodes.value) * 100) : 0
)

watch(
  () => draft.status,
  (value) => {
    if (value === STATUS.WATCHED && episodes.value) draft.progress = episodes.value
  }
)
watch(episodes, (max) => {
  if (Number(draft.progress) > max) draft.progress = max
})

function step(delta) {
  const next = Number(draft.progress) + delta
  draft.progress = Math.min(episodes.value || Infinity, Math.max(0, next))
}

function toggleMood(item) {
  const at = draft.mood.indexOf(item)
  if (at >= 0) draft.mood.splice(at, 1)
  else if (draft.mood.length < 3) draft.mood.push(item)
  if (draft.mood.length >= 3) errors.mood = '心情标签最多选 3 个'
  else delete errors.mood
}

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!draft.animeId) errors.animeId = '请选择一部番剧'
  if (!STATUS_LIST.includes(draft.status)) errors.status = '请选择观看状态'
  const value = Number(draft.progress)
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    errors.progress = '进度需要是 0 以上的整数'
  } else if (episodes.value && value > episodes.value) {
    errors.progress = `进度不能超过 ${episodes.value} 集`
  }
  if (draft.review.length > 200) errors.review = '短评不超过 200 字'
  if (draft.quote.length > 60) errors.quote = '金句不超过 60 字'
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) return
  const payload = {
    ...draft,
    progress: Number(draft.progress) || 0,
    score: Number(draft.score) > 0 ? Number(draft.score) : null,
    mood: [...draft.mood],
    tags: selectedAnime.value?.tags?.length ? [...selectedAnime.value.tags] : [...draft.tags],
  }
  // 新建时 draft.id 是空串。db.saveJournal 里 `...entry` 会覆盖它自动生成的 id，
  // 若传空串（或干脆不传）都会让记录 id 为空，详情/编辑路由拿到空 id 就跳不动。
  // 这里由 C 自己生成一个唯一 id 传进去：新建能拿到有效 id，
  // 命中同用户同番剧的旧空 id 记录时也能把它覆盖成有效值。
  if (!payload.id) {
    payload.id = `j_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  }
  emit('submit', payload)
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="submit">
    <BaseSelect
      v-model="draft.animeId"
      label="番剧"
      :options="animeOptions"
      placeholder="请选择番剧"
      :disabled="isEdit"
      :error="errors.animeId"
      :hint="isEdit ? '编辑模式下番剧不可更改' : ''"
    />

    <BaseSelect
      v-model="draft.status"
      label="观看状态"
      :options="STATUS_LIST"
      :error="errors.status"
      hint="改成「看过」会自动把进度补满"
    />

    <div class="field">
      <span class="label" id="progress-label">观看进度</span>
      <div class="progress-row">
        <BaseButton variant="soft" size="sm" aria-label="进度减一" @click="step(-1)">−</BaseButton>
        <BaseInput
          v-model="draft.progress"
          type="number"
          inputmode="numeric"
          :min="0"
          :max="episodes || undefined"
          :error="errors.progress"
          :hint="`/ ${episodes || '?'} 集`"
        />
        <BaseButton variant="soft" size="sm" aria-label="进度加一" @click="step(1)">＋</BaseButton>
      </div>
      <div class="bar" aria-hidden="true"><span :style="{ width: `${percent}%` }" /></div>
    </div>

    <div class="field">
      <span class="label" id="rating-label">我的评分</span>
      <RatingInput v-model="draft.score" />
      <p class="tip">0 表示不评分，不计入平均分。再点同一档可取消评分。</p>
    </div>

    <BaseTextarea
      v-model="draft.review"
      label="短评"
      :rows="4"
      :maxlength="200"
      placeholder="看到第几集，为什么喜欢，或者为什么弃……"
      :error="errors.review"
    />

    <BaseInput
      v-model="draft.quote"
      label="金句"
      :maxlength="60"
      placeholder="哪一句台词戳中你"
      :hint="`${draft.quote.length} / 60`"
      :error="errors.quote"
    />

    <div class="field">
      <span class="label">心情标签 <small>最多 3 个</small></span>
      <div class="chips">
        <BaseTag
          v-for="item in MOODS"
          :key="item"
          label=""
          tone="pink"
          size="sm"
          clickable
          :active="draft.mood.includes(item)"
          @click="toggleMood(item)"
        >
          {{ item }}
        </BaseTag>
      </div>
      <p v-if="errors.mood" class="error" role="alert">{{ errors.mood }}</p>
    </div>

    <div class="field">
      <span class="label">收藏</span>
      <div>
        <BaseTag
          label=""
          tone="sun"
          size="md"
          clickable
          :active="draft.favorite"
          @click="draft.favorite = !draft.favorite"
        >
          ★ {{ draft.favorite ? '已收藏' : '加入收藏' }}
        </BaseTag>
      </div>
      <p class="tip">开始 / 看完日期会按状态自动记录。</p>
    </div>

    <div class="actions">
      <BaseButton type="submit" variant="coral" :loading="submitting">
        {{ isEdit ? '保存修改' : '建立手帐' }}
      </BaseButton>
      <BaseButton variant="soft" @click="emit('cancel')">取消</BaseButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--sp-5);
  max-width: 620px;
}
.field {
  display: grid;
  gap: var(--sp-2);
}
.label {
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--ink-2);
}
.label small {
  font-weight: 400;
  color: var(--ink-3);
}
.progress-row {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
}
.progress-row :deep(.field) {
  flex: 1;
}
.bar {
  height: 8px;
  border: 1px solid var(--ink);
  border-radius: var(--r-pill);
  background: var(--paper-2);
  overflow: hidden;
}
.bar span {
  display: block;
  height: 100%;
  background: var(--coral);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.tip {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--ink-3);
}
.error {
  margin: 0;
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--danger);
}
.actions {
  display: flex;
  gap: var(--sp-3);
}
</style>
