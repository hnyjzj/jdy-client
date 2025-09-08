<script lang="ts" setup>
useSeoMeta({
  title: '收支数据',
})
const { getPublicWhere, getCashflowList } = useCashflow()
const { timeWhere } = storeToRefs(useCashflow())
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
cashflowLoading.value = true
const getcashflowListFn = async () => {
  const res = await getCashflowList({ ...params.value })
  cashflowTitle.value = res?.title || []
  cashflowList.value = res?.list.sort((a, b) => {
    // 将合计项提到最前面
    if (a.name === '合计')
      return -1
    if (b.name === '合计')
      return 1
    return 0
  }) || []
  cashflowLoading.value = false
}
const getCashflowReq = async () => {
  await getcashflowListFn()
}

const updateTimeFn = () => {
  listJump()
}
onMounted(async () => {
  await nextTick()
  await getCashflowReq()
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-[16px]">
        <div class="flex justify-between items-center py-[12px] text-[#FFF]" />
        <!-- 时间选择器 -->
        <summary-boss-select-time v-model="params" :time-where="timeWhere" @update-time="updateTimeFn" />
        <summary-cashflow-card
          card-title="收支数据"
          :title="cashflowTitle"
          :list="cashflowList"
          :loading="cashflowLoading"
          @getlist="getcashflowListFn" />
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
