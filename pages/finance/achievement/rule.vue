<script setup lang="ts">
import { ruleList } from '~/types/test'
// 测试数据。待替换
const mockData = ruleList
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <finance-achievement-rule :lists="mockData" />
    </div>
    <div class="h-[80px]">
      <common-button-bottom />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
