<script setup>
/**
 * 番剧库（B 负责）—— M1 占位页
 * 静态稿：docs/design/B-library.png；验收项见 docs/acceptance.md F01–F10
 */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="我的番剧库"
    owner="B"
    tone="coral"
    accept="F01–F10：搜索 300ms 防抖、标签/年份/状态组合筛选、三种排序、分页 8 条越界回第 1 页、条件写进 URL、双视图只切 class"
    :todos="[
      '顶部四张统计卡：收藏 / 平均评分 / 已看完 / 正在追（数据来自 useStats）',
      '筛选栏 FILTER LAB：搜索框 + 标签 + 状态 + 年份 + 排序 + 恢复默认',
      '快速筛选 pills 用 BaseTag 渲染 TAG_POOL',
      '海报墙 4 列（列表视图切 .view-list，不重新取数）',
      '卡片：封面、年份、评分、状态角标、番名、日文名、标签',
      '点卡片开详情弹窗（不开新路由），里面能「加入手帐 / 收藏」',
      '分页条 8 条一页，页码与 query 双向同步',
    ]"
  />
</template>
