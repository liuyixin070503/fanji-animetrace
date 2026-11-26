<!-- 骨架块（A 负责）：图片卡/文本行/表格占位，统一用同一个灰阶动画 -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  radius: { type: String, default: 'var(--r-sm)' },
  circle: { type: Boolean, default: false },
  /** >0 时渲染多行文本骨架，行宽依次收窄 */
  lines: { type: Number, default: 0 },
})

const boxStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.circle ? '50%' : props.radius,
}))

const lineWidths = ['100%', '92%', '78%']
</script>

<template>
  <div v-if="lines > 0" class="lines" aria-hidden="true">
    <span
      v-for="index in lines"
      :key="index"
      class="skeleton"
      :style="{ width: lineWidths[index % lineWidths.length] || '100%', height }"
    ></span>
  </div>
  <span v-else class="skeleton" :style="boxStyle" aria-hidden="true"></span>
</template>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
    100deg,
    rgba(27, 27, 27, 0.08) 20%,
    rgba(27, 27, 27, 0.16) 40%,
    rgba(27, 27, 27, 0.08) 60%
  );
  background-size: 220% 100%;
  animation: skeleton-shine 1.4s ease-in-out infinite;
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes skeleton-shine {
  from {
    background-position: 150% 0;
  }
  to {
    background-position: -50% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
