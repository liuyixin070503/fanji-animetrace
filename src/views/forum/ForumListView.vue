<script setup>
/** 论坛列表（D 负责）—— M1 占位页，静态稿 docs/design/D-forum.png */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="大家在聊什么"
    owner="D"
    tone="mint"
    accept="H01–H08：板块 tab、排序（最新回复 / 最新发布 / 最热）、热度=点赞×2+评论×3、点赞防重、分页"
    :todos="[
      '顶部 hero：标题卡 + 「+ 发一个新帖」',
      '板块 tabs：全部 / 讨论 / 求推荐 / 吐槽 / 资源情报，带条数',
      '排序下拉：最新回复 / 最新发布 / 最热',
      '帖子卡：作者头像 + 昵称 + 时间、板块徽标、标题、摘要两行、关联番剧、点赞数、评论数、最后回复',
      '点赞调 db.toggleLike，同一人只能点一次（已赞高亮）',
      ':board / :sort / :page 全部同步到 query',
      '空状态：这个板块还没人发帖',
    ]"
  />
</template>
