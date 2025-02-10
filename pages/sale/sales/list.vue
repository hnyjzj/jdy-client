<script setup lang="ts">
// 销售单列表页

useSeoMeta({
  title: '销售单列表',
})

// 测试数据。需删除替换
const saleList: any[] = [
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
      <div class="flex flex-row gap-2">
        <product-manage-company class="color-[#fff]" />
        <product-filter-search class="color-[#fff] flex-1" />
      </div>
      <!-- data -->
      <div class="flex-center-between gap-2">
        <div class="text-size-[14px] color-[#fff]">
          共{{ saleList[0].store.salesVolume }}条数据
        </div>
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- cards -->
      <sale-sales-list :info="saleList" @user-click="handleClick" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
