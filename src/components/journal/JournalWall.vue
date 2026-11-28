<script setup>
// C · 手帐墙：按 STATUS_LIST 顺序分组，只做编排展示。
import { computed } from 'vue'
import JournalCard from './JournalCard.vue'
import { STATUS_LIST, STATUS_META } from '../../types/db.js'

const props = defineProps({
  entries: { type: Array, default: () => [] },
  animeMap: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['open', 'edit', 'remove'])

const groups = computed(() =>
  STATUS_LIST.map((status) => ({
    status,
    label: STATUS_META[status].label,
    token: STATUS_META[status].token,
    items: props.entries.filter((entry) => entry.status === status),
  })).filter((group) => group.items.length > 0)
)
</script>

<template>
  <div class="wall">
    <section v-for="group in groups" :key="group.status" class="group">
      <h2 class="title">
        <span class="dot" :style="{ background: `var(${group.token})` }" aria-hidden="true" />
        {{ group.label }}
        <small>{{ group.items.length }} 条</small>
      </h2>
      <div class="grid">
        <JournalCard
          v-for="entry in group.items"
          :key="entry.id"
          :entry="entry"
          :anime="animeMap[entry.animeId]"
          @open="emit('open', $event)"
          @edit="emit('edit', $event)"
          @remove="emit('remove', $event)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.wall {
  display: grid;
  gap: var(--sp-7);
}
.title {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin: 0 0 var(--sp-4);
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-weight: 800;
}
.title small {
  font-size: var(--fs-xs);
  font-weight: 400;
  color: var(--ink-3);
}
.dot {
  width: 10px;
  height: 10px;
  border: 1px solid var(--ink);
  border-radius: var(--r-xs);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: var(--sp-6) var(--sp-5);
  padding: var(--sp-3) var(--sp-2) var(--sp-1);
}
@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
@media (max-width: 767px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--sp-5) var(--sp-3);
  }
}
</style>
