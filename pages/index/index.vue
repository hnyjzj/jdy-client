<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

const { myStoreTodaySale, myStoreTodayInventory, myStoreTodayPayment, getTargetStatistic } = homeDataStore()
const { TodayInventory, todaySaleData, Payments, targetStatistic } = storeToRefs(homeDataStore())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()
const { getPerformanceList } = useBoss()
if (!myStore.value.id) {
  await getMyStore()
}

// 切换门店
const handleSelectFn = async () => {
  await myStoreTodaySale({ store_id: myStore.value.id })
  await myStoreTodayInventory({ store_id: myStore.value.id })
  await myStoreTodayPayment({ store_id: myStore.value.id })
  await getTargetStatistic({ store_id: myStore.value.id })
}

await myStoreTodayInventory({ store_id: myStore.value.id })
await myStoreTodaySale({ store_id: myStore.value.id })
await myStoreTodayPayment({ store_id: myStore.value.id })
await getTargetStatistic({ store_id: myStore.value.id })

// 业绩
const params = ref({ duration: 1 } as BossWhere)
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

onMounted(async () => {
  await nextTick()
  await getPerformanceListFn()
})
</script>

<template>
  <div>
    <div class="p-[16px] bg-[#3875C5]">
      <common-layout-center>
        <div>
          <div class="flex items-center justify-between mb-[16px]">
            <product-manage-company :is-white="true" @change="handleSelectFn" />
            <common-dark />
          </div>
          <div class="pl-[16px]">
            <home-greet />
          </div>
        </div>
      </common-layout-center>
      <common-tabbar text="todo" />
    </div>
    <div>
      <common-layout-center>
        <div class="flex flex-col gap-[20px] px-[16px] pb-[120px]">
          <template v-if="myStore.id || myStore.id === ''">
            <template v-if="Payments">
              <summary-card-payment title="今日收支" :payments="Payments" @click-title="jump('/summary/cashflow')" />
            </template>
            <template v-if="todaySaleData">
              <summary-card-sale :today-sale-data="todaySaleData" @click-title="jump('/summary/sale')" />
            </template>
            <template v-if="TodayInventory">
              <summary-card-inventory :today-inventory="TodayInventory" @click-title="jump('/summary/stock')" />
            </template>
            <template v-if="targetStatistic?.target_id">
              <summary-card-target :data="targetStatistic" @click-title="jump('/target/info', { id: targetStatistic.target_id })" />
            </template>

            <template v-if="performanceList.length > 0">
              <summary-boss-card
                card-title="跨门店实时业绩"
                :title="performanceTitle"
                :list="performanceList"
                :loading="PerformanceLoading"
                @getlist="getPerformanceListFn"
                @click-title="jump('/summary/boss')" />
            </template>
          </template>
          <template v-else>
            <common-emptys text="暂未分配门店" />
          </template>
        </div>
      </common-layout-center>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
