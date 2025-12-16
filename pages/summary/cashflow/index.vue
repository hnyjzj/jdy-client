<script lang="ts" setup>
useSeoMeta({
  title: '收支统计',
})
const { getPublicWhere, getCashflowList } = useCashflow()
const { timeWhere } = storeToRefs(useCashflow())
const { myStore } = storeToRefs(useStores())
const params = ref({} as CashflowWhere)
await getPublicWhere()

// 读取url参数,获取列表
const route = useRoute()
const handleQueryParams = async () => {
  params.value = {} as CashflowWhere
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
  const url = UrlAndParams('/summary/cashflow', params.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

// 业绩统计初始化
const cashflowLoading = ref<boolean>(false)
const cashflowTitle = ref<StockTitle[]>([])
const cashflowList = ref<BossSalesList[]>([])
const sourceTitle = ref<StockTitle[]>([])
const sourceList = ref<Record<string, string>[]>([])
cashflowLoading.value = true
const getcashflowListFn = async () => {
  const res = await getCashflowList({ ...params.value, store_id: myStore.value.id })
  cashflowTitle.value = res?.title || []
  cashflowList.value = res?.list.sort((a, b) => {
    // 将合计项提到最前面
    if (a.name === '合计')
      return -1
    if (b.name === '合计')
      return 1
    return 0
  }) || []
  sourceTitle.value = res?.sourceTitle || []
  sourceList.value = res?.sourceList || []
  cashflowLoading.value = false
}

const updateTimeFn = () => {
  listJump()
}
const { overview } = storeToRefs(useCashflow())
const changeStore = async () => {
  await getcashflowListFn()
}
await getcashflowListFn()
</script>

<template>
  <div>
    <summary-boss-select-time v-model="params" :time-where="timeWhere" @change-stores="changeStore" @update-time="updateTimeFn" />

    <common-layout-center>
      <div class="px-[16px]">
        <!-- 时间选择器 -->
        <div class="pb-[12px]">
          <summary-card-payment title="数据总览" :payments="overview" />
        </div>
        <summary-cashflow-card
          card-title="收支统计"
          :title="cashflowTitle"
          :list="cashflowList"
          @getlist="getcashflowListFn" />
        <summary-cashflow-source-card :title="sourceTitle" :list="sourceList">
          <template #header-title>
            收支明细
          </template>
        </summary-cashflow-source-card>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
