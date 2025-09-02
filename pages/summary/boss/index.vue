<script lang="ts" setup>
useSeoMeta({
  title: 'boss看板',
})
const { getOldSalesList, getOldSalesType, getOldSalesTitle, getFinishedSalesType, getFinishedSalesTitle, getFinishedSalesList, getStockTitle, getStockList, getStockType, OldGetStockType, OldGetStockTitle, OldGetStockList, getRevenueList, getRevenueWhere, getRevenueTitle } = useStock()
const params = ref({
  duration: 1,
} as Revenue)
// 成品统计
const radioValueFinsihed = ref<Revenue['type']>(1)
const getFinishedList = async () => {
  await getStockList({ ...params.value, type: radioValueFinsihed.value })
}

const getFinishedStockReq = async () => {
  await getStockTitle()
  await getStockType()
  await getFinishedList()
}

// 旧料统计
const radioValueOld = ref<Revenue['type']>(1)
const getOldList = async () => {
  await OldGetStockList({ ...params.value, type: radioValueOld.value })
}
const getOldStockReq = async () => {
  await OldGetStockType()
  await OldGetStockTitle()
  await getOldList()
}
// 收支统计初始化
const radioValueRevenue = ref<Revenue['type']>(1)
const getRevenueListFn = async () => {
  await getRevenueList({ ...params.value, type: radioValueRevenue.value })
}
const getRevenueReq = async () => {
  await getRevenueWhere()
  await getRevenueTitle()
  await getRevenueListFn()
}

// 成品销售
const radioValueFinishedSale = ref<Revenue['type']>(1)
const getFinishedSaleListFn = async () => {
  await getFinishedSalesList({ ...params.value, type: radioValueFinishedSale.value })
}
// 成品销售初始化
const getFinishedSaleReq = async () => {
  await getFinishedSalesType()
  await getFinishedSalesTitle()
  await getFinishedSaleListFn()
}

// 旧料销售
const radioValueOldSale = ref<Revenue['type']>(1)
const getOldSaleListFn = async () => {
  await getOldSalesList({ ...params.value, type: radioValueOldSale.value })
}

const getOldSaleReq = async () => {
  await getOldSalesType()
  await getOldSalesTitle()
  await getOldSaleListFn()
}

const updateTimeFn = async () => {
  await getFinishedList()
  await getOldList()
  await getRevenueListFn()
  await getFinishedSaleListFn()
}

onMounted(async () => {
  await getFinishedStockReq()
  await getOldStockReq()
  await getRevenueReq()
  await getFinishedSaleReq()
  await getOldSaleReq()
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-[16px]">
        <div class="flex justify-between items-center py-[12px] text-[#FFF]" />
        <!-- 时间选择器 -->
        <summary-boss-select-time v-model="params" @update-time="updateTimeFn" />
        <!-- 成品销售 -->
        <summary-boss-finished-sales v-model="radioValueFinishedSale" @getlist="getFinishedSaleListFn" />
        <!-- 旧料销售 -->
        <summary-boss-old-sales v-model="radioValueOldSale" @getlist="getOldSaleListFn" />
        <!-- 收支统计 -->
        <summary-boss-revenue v-model="radioValueRevenue" @getlist="getRevenueListFn" />
        <!-- 成品统计 -->
        <summary-boss-finished v-model="radioValueFinsihed" @getlist="getFinishedList" />
        <!-- 旧料统计 -->
        <summary-boss-old-product v-model="radioValueOld" @getlist="getOldList" />
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
