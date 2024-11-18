<script setup lang="ts">
import { repair } from '~/types/test'
// 测试数据。待替换
const repairInfo = ref(repair)
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <sale-repair-info :info="repairInfo" />
    </div>
    <div class="h-[80px]">
      <common-button-bottom confirm-text="开单" cancel-text="取消" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
