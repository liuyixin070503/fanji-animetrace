<script setup>
/** 我的手帐（C 负责）—— M1 占位页，静态稿 docs/design/C-journal.png */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="我的手帐"
    owner="C"
    tone="lilac"
    accept="G01–G08：状态 tab 计数、一页一番的卡片网格、排序切换、空状态、点卡片进详情"
    :todos="[
      '顶部 hero：标题卡 + 「+ 从番剧库导入」按钮',
      '状态 tabs：全部 / 在看 / 看过 / 想看 / 搁置 / 弃番，tab 上带条数（来自 useStats 的 statusDistribution）',
      '卡片网格 3 列：胶带装饰、状态徽标、评分右上、短评两行截断、进度 + 日期',
      '卡片按 updatedAt 倒序，支持「最近更新 / 评分」两种排序',
      '空状态用 EmptyState，引导去番剧库',
    ]"
  />
</template>
