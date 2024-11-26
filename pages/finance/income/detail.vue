<script setup lang="ts">
// 测试数据。待替换
const repairInfo = [
  {
    name: '创建时间',
    desc: '2022-01-01 12:00:00',
  },
  {
    name: '所属门店',
    desc: '洛阳XXXXXXX分店',
  },
  {
    name: '关联单号',
    desc: 'SZ21473209174238',
  },
]
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <finance-income-detail :info="repairInfo" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
