<script setup lang="ts">
const ruleList: Rule[] = [
  {
    name: '镶嵌旧料',
    category: [
      {
        name: '玉石',
        source: '回收',
      },
      {
        name: '金属',
        source: '兑换',
      },
      {
        name: '金属',
        source: '兑换',
      },
      {
        name: '金属',
        source: '兑换',
      },
    ],
  },
  {
    name: '黄金旧料',
    category: [
      {
        name: '玉石',
        source: '回收',
      },
      {
        name: '金属',
        source: '兑换',
      },
    ],
  },
]
</script>

<template>
  <div class="grid-12">
    <!-- <div @click="handleClick">
      测试
    </div> -->
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <finance-achievement-rule :lists="ruleList" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
