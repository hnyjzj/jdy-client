<script setup lang="ts">
useSeoMeta({
  title: '退货明细',
})

// 测试数据。待替换
const refundDetail: any[] = [
  {
    num: 'CZ-32493974',
    store: {
      name: '青青草原一号店',
      salesVolume: 100000,
    },
    member: {
      nickname: '张三',
      phone: '13800138000',
      level: 2,
    },
    mainSalesman: '李四',
    goodsInfo: '足金挂坠',
    quantity: 55789,
    realAmount: 25000,
    goodsAmount: 15000,
    discountAmount: '100',
    oldDiscountAmount: '20',
    integral: '32',
    openType: '线下开单',
    createTime: '2021-11-11 11:11:11',
    slipStatus: 2,
  },
]

const handleClick = async () => {
// 跳转到详情页
  await navigateTo('/sale/sales/order')
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- header -->
      <!-- 搜索 -->
      <div class="flex flex-row gap-[12px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- content -->
      <sale-sales-refund :info="refundDetail" @user-click="handleClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
