<script setup lang="ts">
// 销售明细页面
useSeoMeta({
  title: '销售明细',
})

// 测试数据。待删除
const saleList: SalesSlip[] = [
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
    openType: '已回收',
    createTime: '2021-11-11 11:11:11',
    slipStatus: 2,
  },
]
interface Pics {
  url: string[]
  data: string
}
const pics: Pics[] = [
  {
    url: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    ],
    data: '2021-11-11 11:11:11',
  },
]

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

const handleClick = async () => {
// 跳转到详情页
  await navigateTo('/sale/sales/order')
}

const currentSelected = ref(1)

const detailsCards = resolveComponent('sale-sales-details')
// currentSelected.value = 2 时，切换到销售明细图
const detailsChart = resolveComponent('sale-sales-chart')
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
        :pics="pics"
        @user-click="handleClick"
      />
    </div>
  </div>
</template>
