<script setup lang="ts">
import { depositList, pics } from '~/types/test'
// 销售明细页面
useSeoMeta({
  title: '销售明细',
})

const options = [
  {
    label: '销售明细',
    value: 1,
  },
  {
    label: '销售明细图',
    value: 2,
  },
]

const currentSelected = ref(1)

const detailsCards = resolveComponent('sale-sales-details')
// currentSelected.value = 2 时，切换到销售明细图
const detailsChart = resolveComponent('sale-sales-chart')

// 测试数据。待替换
const saleList = depositList
const pices = pics

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
      <!-- 切换tab -->
      <common-tab-secondary v-model:current-selected="currentSelected" :options="options" />
      <!-- content -->
      <component
        :is="currentSelected === 1 ? detailsCards : detailsChart"
        :info="saleList"
        :pics="pices"
        @user-click="handleClick"
      />
    </div>
  </div>
</template>
