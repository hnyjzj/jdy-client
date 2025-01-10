<script setup lang="ts">
useSeoMeta({
  title: '积分记录',
})

const integrals: any[] = [
  {
    userInfo: {
      nickname: '沈易',
      phone: '13799000000',
      level: 1,
    },
    type: '加积分',
    reason: 2,
    before: 150,
    after: 250,
    createTime: '2023-03-01 10:10:10',
    orderId: 'DD131294379284',
  },
  {
    userInfo: {
      nickname: '沈易',
      phone: '13799000000',
      level: 1,
    },
    type: '加积分',
    reason: 3,
    before: 150,
    after: 250,
    createTime: '2023-03-01 10:10:10',
    orderId: 'DD131294379284',
  },
]
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[20px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>

      <member-integral-record :data="integrals" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
