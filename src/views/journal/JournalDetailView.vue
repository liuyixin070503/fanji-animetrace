<script setup>
/** 手帐详情（C 负责）—— M1 占位页 */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="手帐详情"
    owner="C"
    tone="lilac"
    accept="G13–G15：完整展示一部番的记录、可编辑、可删除（删除要二次确认）"
    :todos="[
      '大封面 + 番名 + 状态 / 进度 / 评分 / 收藏',
      '短评、金句、心情标签、标签',
      '右下角「编辑」「删除」按钮（删除用 ConfirmDialog）',
      '找不到 id 时显示 EmptyState + 回手帐列表',
    ]"
  />
</template>
