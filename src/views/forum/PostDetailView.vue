<script setup>
/** 帖子详情（D 负责）—— M1 占位页 */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="帖子详情"
    owner="D"
    tone="mint"
    accept="H13–H16：正文完整展示、评论列表按时间正序、发表评论 1–200 字、点赞"
    :todos="[
      '帖子头部：作者、时间、板块、关联番剧、点赞按钮',
      '正文保留换行（white-space: pre-wrap）',
      '评论区：头像 + 昵称 + 时间 + 内容',
      '评论输入框固定在列表下方，发送后清空并 toast',
      '找不到 id 时显示 EmptyState + 回论坛',
    ]"
  />
</template>
