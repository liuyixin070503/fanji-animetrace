<script setup>
/** 发新帖（D 负责）—— M1 占位页 */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="发一个新帖"
    owner="D"
    tone="mint"
    accept="H09–H12：标题 5–40 字、正文 10–500 字、可选板块与关联番剧、提交后跳详情页"
    :todos="[
      '板块单选（默认讨论）',
      '关联番剧（可选，从 ANIME 里选）',
      '标题 input，实时显示字数（5–40）',
      '正文 textarea，实时显示字数（10–500）',
      '校验走 useForm，提交走 db.savePost',
      '未登录直接访问要跳登录（路由守卫已做）',
    ]"
  />
</template>
