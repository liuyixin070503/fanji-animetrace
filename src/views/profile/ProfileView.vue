<script setup>
/** 个人中心（E 负责）—— M1 占位页，静态稿 docs/design/E-profile.png */
import PageStub from '../../components/layout/PageStub.vue'
</script>

<template>
  <PageStub
    title="个人中心"
    owner="E"
    tone="sun"
    accept="I01–I08：资料卡可编辑昵称/简介、四张数字卡、状态分布环图、评分分布柱图、标签偏好条形图、月度热力图（全部手写 SVG/CSS）"
    :todos="[
      '资料卡：大头像（avatarSeed 上色）、昵称、简介、注册时间、统计条数',
      '「编辑资料」走 BaseModal 改昵称/简介/简介字数限制',
      '四张数字卡：追番总数 / 已看完 / 平均评分 / 论坛发帖',
      '状态分布环图（SVG circle stroke-dasharray）',
      '评分分布柱图（6–7 / 7–8 / 8–9 / 9–10 四档）',
      '标签偏好横条（top6，最长条占满宽度）',
      '月度记录热力图 12 列 × 4 行，颜色深浅按当周条数',
      '数据全部来自 useStats()，不要自己算',
    ]"
  />
</template>
