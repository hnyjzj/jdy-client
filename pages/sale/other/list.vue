<script setup lang="ts">
// 测试数据。待替换
const depositList: SalesSlip[] = [
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
    openType: '预定中',
    createTime: '2021-11-11 11:11:11',
    slipStatus: 2,
  },
]
// 其他收支单列表
useSeoMeta({
  title: '其他收支单列表',
})

const handleAmend = async () => {
// 携参跳转到详情页
  await navigateTo('/sale/other/info')
}

const show = ref(false)
const handleDelete = () => {
  show.value = !show.value
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="确认删除">
      <div class="flex-center-col gap-[12px] text-[14px] color-[#333] pb-[32px]">
        <span>确认删除该条记录吗？</span>
        <span>删除后不可恢复，请谨慎处理。</span>
      </div>
    </common-model>
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- header -->
      <!-- 搜索 -->
      <div class="flex flex-row gap-[12px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- content -->
      <sale-other-list :info="depositList" @amend="handleAmend" @delete="handleDelete" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
