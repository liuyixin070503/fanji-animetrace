<script setup>
/**
 * 新建 / 编辑手帐（C 负责）—— M1 占位页
 * 同一个组件两种模式，靠 route.meta.mode 区分（create / edit）。
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageStub from '../../components/layout/PageStub.vue'

const route = useRoute()
const isEdit = computed(() => route.meta.mode === 'edit')
</script>

<template>
  <PageStub
    :title="isEdit ? '编辑手帐' : '新建手帐'"
    owner="C"
    tone="lilac"
    accept="G09–G12：进度不得超过总集数、状态改「看过」自动补满、评分 0.5 步进、短评 ≤200、金句 ≤60、心情最多 3 个"
    :todos="[
      '选择番剧（从 ANIME 列表里选，编辑模式下锁定不可改）',
      '状态单选：想看 / 在看 / 看过 / 搁置 / 弃番',
      '进度滑杆或数字输入，上限 = 该番总集数',
      '评分 0.5 一档（0 表示不评分，不计入均分）',
      '短评 textarea（≤200）+ 金句 input（≤60）',
      '心情多选 BaseTag，最多 3 个',
      '收藏开关 + 开始/看完日期',
      '提交走 db.saveJournal，成功后回 /journal 并 toast',
    ]"
  />
</template>
