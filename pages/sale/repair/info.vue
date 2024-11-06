<script setup lang="ts">
// 测试数据。待删除
const repairInfo = ref([
  {
    name: '状态',
    desc: '门店已收货',
  },
  {
    name: '问题描述',
    desc: '项链断开',
  },
  {
    name: '维修费',
    desc: '12312',
  },
  {
    name: '维修成本',
    desc: '99',
  },
])
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
