<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

const { myStoreTodaySale, myStoreTodayInventory } = homeDataStore()
const { TodayInventory, todaySaleData } = storeToRefs(homeDataStore())
const { myStore, myStoreList } = storeToRefs(useStores())
const { getMyStore, switchStore } = useStores()
const { getPerformanceType, getPerformanceList } = useBoss()
if (!myStore.value.id) {
  await getMyStore()
}

// 切换门店
const handleSelectFn = async (id: Stores['id']) => {
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
    await myStoreTodaySale({ store_id: myStore.value.id })
    await myStoreTodayInventory({ store_id: myStore.value.id })
  }
}

await myStoreTodayInventory({ store_id: myStore.value.id })
await myStoreTodaySale({ store_id: myStore.value.id })

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

const getPerformanceReq = async () => {
  await getPerformanceType()
  await getPerformanceListFn()
}
onMounted(async () => {
  await getPerformanceReq()
})
</script>

<template>
  <div class="grid-12 pb-[120px]!">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <img src="/images/banner/work.png" class="w-[200px]">
      </div>
      <home-greet />
      <common-dark />
      <!-- 判断门店是否存在，id为空字符串则是管理员权限，也显示 -->
      <template v-if="myStore.id || myStore.id === ''">
        <home-store
          v-model:store="myStore"
          :store-list="myStoreList"
          @handle-select="handleSelectFn"
          @get-store-list="() => {
            getMyStore()
          }" />

        <!-- <home-action /> -->
        <template v-if="todaySaleData">
          <summary-card-sale :today-sale-data="todaySaleData" />
        </template>
        <template v-if="TodayInventory">
          <summary-card-inventory :today-inventory="TodayInventory" />
        </template>
        <summary-boss-card
          card-title="跨门店实时业绩"
          :title="performanceTitle"
          :list="performanceList"
          :loading="PerformanceLoading"
          @getlist="getPerformanceListFn" />
      </template>
      <template v-else>
        <common-emptys text="暂未分配门店" />
      </template>
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>
