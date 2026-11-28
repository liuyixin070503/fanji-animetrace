<script setup>
// C · 10 星评分，0.5 步进。每颗星切左右两个热区：左半 = n-0.5，右半 = n。
// 悬停/聚焦时实时预览分数，并在星星上方标出左右半的数值，避免"为什么有时 0.5 有时 1"的困惑。
import { computed, ref } from 'vue'
import { formatScore } from '../../utils/format.js'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
})
const emit = defineEmits(['update:modelValue'])

const hover = ref(null)
const score = computed(() => {
  const value = Number(props.modelValue)
  return Number.isFinite(value) && value > 0 ? value : 0
})
const shown = computed(() => (hover.value === null ? score.value : hover.value))

function fillWidth(n) {
  return `${Math.min(1, Math.max(0, shown.value - (n - 1))) * 100}%`
}

function set(value) {
  emit('update:modelValue', score.value === value ? null : value)
}

function preview(value) {
  hover.value = value
}
function clearPreview() {
  hover.value = null
}
</script>

<template>
  <div class="rating">
    <div class="stars" role="radiogroup" aria-label="10 星评分：点左半星得 0.5 分，右半星得 1 分">
      <div v-for="n in 10" :key="n" class="slot">
        <span class="base" aria-hidden="true">★</span>
        <span class="fill" :style="{ width: fillWidth(n) }" aria-hidden="true">★</span>
        <span class="hint" aria-hidden="true">{{ n - 0.5 }} / {{ n }}</span>
        <button
          type="button"
          class="hot left"
          role="radio"
          :aria-checked="score === n - 0.5"
          :aria-label="`${n - 0.5} 分：第 ${n} 颗星的左半`"
          :title="`${n - 0.5} 分（左半星）`"
          @mouseenter="preview(n - 0.5)"
          @mouseleave="clearPreview"
          @focus="preview(n - 0.5)"
          @blur="clearPreview"
          @click="set(n - 0.5)"
        />
        <button
          type="button"
          class="hot right"
          role="radio"
          :aria-checked="score === n"
          :aria-label="`${n} 分：第 ${n} 颗星的右半`"
          :title="`${n} 分（右半星）`"
          @mouseenter="preview(n)"
          @mouseleave="clearPreview"
          @focus="preview(n)"
          @blur="clearPreview"
          @click="set(n)"
        />
      </div>
    </div>
    <span class="value">
      {{ shown ? formatScore(shown) : '未评分' }}
      <small v-if="hover !== null">预览</small>
    </span>
    <button v-if="score" type="button" class="clear" @click="emit('update:modelValue', null)">
      清除
    </button>
    <p class="legend">每颗星分左右两半：左半 = 0.5 档，右半 = 整数档；再点同一档取消评分。</p>
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-3);
}
.stars {
  display: flex;
  gap: 1px;
}
.slot {
  position: relative;
  width: 26px;
  height: 28px;
  font-size: 26px;
  line-height: 28px;
  user-select: none;
}
.base,
.fill {
  position: absolute;
  inset: 0 auto auto 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
}
.base {
  color: var(--paper-2);
  -webkit-text-stroke: 1px var(--ink);
}
.fill {
  color: var(--sun);
  -webkit-text-stroke: 1px var(--ink);
}
.hot {
  position: absolute;
  top: 0;
  width: 50%;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.hot.left {
  left: 0;
}
.hot.right {
  right: 0;
}
/* 悬停时用一条虚线把"半星热区"画出来 */
.hot.left::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 0;
  bottom: 5px;
  border-right: 1px dashed var(--ink);
  opacity: 0;
}
.slot:hover .hot.left::after {
  opacity: 0.45;
}
.hint {
  position: absolute;
  top: -19px;
  left: 50%;
  z-index: 2;
  padding: 1px 5px;
  border-radius: var(--r-xs);
  background: var(--ink);
  color: var(--paper);
  font-size: 10px;
  line-height: 1.3;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%);
  transition: opacity var(--dur-fast) var(--ease);
}
.slot:hover .hint,
.slot:focus-within .hint {
  opacity: 1;
}
.hot:focus-visible,
.clear:focus-visible {
  outline: 3px solid var(--coral);
  outline-offset: 1px;
}
.value {
  min-width: 48px;
  font-size: var(--fs-sm);
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.value small {
  font-size: 10px;
  color: var(--ink-3);
}
.clear {
  min-height: 32px;
  border: 0;
  background: transparent;
  color: var(--ink-3);
  font: inherit;
  font-size: var(--fs-xs);
  text-decoration: underline;
  cursor: pointer;
}
.legend {
  flex-basis: 100%;
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--ink-3);
}
@media (prefers-reduced-motion: reduce) {
  .hint {
    transition: none;
  }
}
</style>
