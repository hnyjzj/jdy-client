<script lang="ts" setup>
useSeoMeta({
  title: 'Boss看板',
})
const { getPerformanceType, getPerformanceList, getPublicWhere, getOldSalesList, getOldSalesType, getFinishedSalesType, getFinishedSalesList, getStockList, getStockType, OldGetStockType, OldGetStockList, getRevenueList, getRevenueWhere } = useBoss()
const { RevenueWhere, finishedSalesWhere, oldfilterWhere, oldSalesFilterWhere, finishedWhere } = storeToRefs(useBoss())
const params = ref({} as BossWhere)
await getPublicWhere()

// 读取url参数,获取列表
const route = useRoute()
const handleQueryParams = async () => {
  params.value = {} as BossWhere
  if (route.query?.duration) {
    params.value.duration = Number(route.query?.duration)
  }
  else {
    params.value.duration = 1
  }
  if (route.query?.startTime) {
    params.value.startTime = route.query?.startTime as string
  }
  if (route.query?.endTime) {
    params.value.endTime = route.query?.endTime as string
  }
}
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/summary/boss', params.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
// 成品销售
const radioValueFinishedSale = ref<BossWhere['type']>(1)
const finishedSalesLoading = ref<boolean>(false)
const finishedSalesTitle = ref<StockTitle[]>([])
const finishedSalesList = ref<BossSalesList[]>([])
finishedSalesLoading.value = true
const getFinishedSaleListFn = async () => {
  finishedSalesLoading.value = true
  const res = await getFinishedSalesList({ ...params.value, type: radioValueFinishedSale.value })
  finishedSalesTitle.value = res?.title || []
  finishedSalesList.value = res?.list || []
  finishedSalesLoading.value = false
}
// 成品销售初始化
const getFinishedSaleReq = async () => {
  await getFinishedSalesType()
  await getFinishedSaleListFn()
}

// 收支统计初始化
const radioValueRevenue = ref<BossWhere['type']>(1)
const RevenueLoading = ref<boolean>(false)
const RevenueTitle = ref<StockTitle[]>([])
const RevenueList = ref<BossSalesList[]>([])
RevenueLoading.value = true
const getRevenueListFn = async () => {
  RevenueLoading.value = true
  const res = await getRevenueList({ ...params.value, type: radioValueRevenue.value })
  RevenueTitle.value = res?.title || []
  RevenueList.value = res?.list || []
  RevenueLoading.value = false
}
const getRevenueReq = async () => {
  await getRevenueWhere()
  await getRevenueListFn()
}

// 旧料销售
const radioValueOldSale = ref<BossWhere['type']>(1)
const oldSalesTitle = ref<StockTitle[]>([])
const oldSalesList = ref<BossSalesList[]>([])
const oldSalesLoading = ref<boolean>(false)
oldSalesLoading.value = true
const getOldSaleListFn = async () => {
  oldSalesLoading.value = true
  const res = await getOldSalesList({ ...params.value, type: radioValueOldSale.value })
  oldSalesTitle.value = res?.title || []
  oldSalesList.value = res?.list || []
  oldSalesLoading.value = false
}

const getOldSaleReq = async () => {
  await getOldSalesType()
  await getOldSaleListFn()
}

// 成品统计
const radioValueFinsihed = ref<BossWhere['type']>(1)
const finishedTitle = ref<StockTitle[]>([])
const finishedList = ref<BossSalesList[]>([])
const finishedLoading = ref<boolean>(false)
finishedLoading.value = true
const getFinishedList = async () => {
  finishedLoading.value = true
  const res = await getStockList({ ...params.value, type: radioValueFinsihed.value })
  finishedTitle.value = res?.title || []
  finishedList.value = res?.list || []
  finishedLoading.value = false
}
const getFinishedStockReq = async () => {
  await getStockType()
  await getFinishedList()
}

// 旧料统计
const radioValueOld = ref<BossWhere['type']>(1)
const oldtitle = ref<StockTitle[]>([])
const oldList = ref<BossSalesList[]>([])
const oldLoading = ref<boolean>(false)
oldLoading.value = true
const getOldList = async () => {
  oldLoading.value = true
  const res = await OldGetStockList({ ...params.value, type: radioValueOld.value })
  oldtitle.value = res?.title || []
  oldList.value = res?.list || []
  oldLoading.value = false
}
const getOldStockReq = async () => {
  await OldGetStockType()
  await getOldList()
}

// 业绩统计初始化

const PerformanceLoading = ref<boolean>(false)
const performanceTitle = ref<StockTitle[]>([])
const performanceList = ref<BossSalesList[]>([])
PerformanceLoading.value = true
const getPerformanceListFn = async () => {
  const res = await getPerformanceList({ ...params.value })
  performanceTitle.value = res?.title || []
  performanceList.value = res?.list || []
  PerformanceLoading.value = false
}
const getPerformanceReq = async () => {
  await getPerformanceType()
  await getPerformanceListFn()
}

const updateTimeFn = () => {
  listJump()
}
onMounted(async () => {
  await nextTick()
  await getPerformanceReq()
  await getFinishedSaleReq()
  await getRevenueReq()
  await getOldSaleReq()
  await getFinishedStockReq()
  await getOldStockReq()
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-[16px]">
        <div class="flex justify-between items-center py-[12px] text-[#FFF]" />
        <!-- 时间选择器 -->
        <summary-boss-select-time v-model="params" @update-time="updateTimeFn" />
        <!-- 性能统计 -->
        <summary-boss-card
          card-title="业绩统计"
          :title="performanceTitle"
          :list="performanceList"
          :loading="PerformanceLoading"
          @getlist="getPerformanceListFn" />
        <!-- 收支统计 -->
        <summary-boss-card
          v-model="radioValueRevenue"
          card-title="收支统计"
          :where="RevenueWhere"
          :title="RevenueTitle"
          :list="RevenueList"
          :loading="RevenueLoading"
          @getlist="getRevenueListFn" />
        <!-- 成品销售 -->
        <summary-boss-card
          v-model="radioValueFinishedSale"
          card-title="成品销售"
          :where="finishedSalesWhere"
          :title="finishedSalesTitle"
          :list="finishedSalesList"
          :loading="finishedSalesLoading"
          @getlist="getFinishedSaleListFn" />

        <!-- 旧料销售 -->
        <summary-boss-card
          v-model="radioValueOldSale"
          card-title="旧料销售"
          :where="oldSalesFilterWhere"
          :title="oldSalesTitle"
          :list="oldSalesList"
          :loading="oldSalesLoading"
          @getlist="getOldSaleListFn" />
        <!-- 成品统计 -->
        <summary-boss-card
          v-model="radioValueFinsihed"
          card-title="成品库存"
          :where="finishedWhere"
          :title="finishedTitle"
          :list="finishedList"
          :loading="finishedLoading"
          @getlist="getFinishedList" />
        <!-- 旧料统计 -->
        <summary-boss-card
          v-model="radioValueOld"
          card-title="旧料库存"
          :where="oldfilterWhere"
          :title="oldtitle"
          :list="oldList"
          :loading="oldLoading"
          @getlist="getOldList" />
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
