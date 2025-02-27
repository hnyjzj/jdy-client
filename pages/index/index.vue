<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

const { StorePerformance, myStoreTodaySale, myStoreTodayInventory } = homeDataStore()
const { StorePerformanceList, todaySaleData, TodayInventory } = storeToRefs(homeDataStore())
const { myStore } = storeToRefs(useStores())

await StorePerformance({ duration: 'today' })
await myStoreTodaySale({ store_id: myStore.value.id })
await myStoreTodayInventory({ store_id: myStore.value.id })
const todaySaleDataList = ref<homeDataListCard[]>([{
  title: '销售金额',
  key: 'sales_amount',
  number: 0,
}, {
  title: '销售件数',
  key: 'sales_count',
  number: 0,
}, {
  title: '旧货抵值',
  key: 'old_goods_amount',
  number: 0,
}, {
  title: '退货金额',
  key: 'return_amount',
  number: 0,
}])
const TodayInventoryList = ref<homeDataListCard[]>([{
  title: '旧料库存件数',
  key: 'old_stock_count',
  number: 0,
}, {
  title: '旧料库存金重',
  key: 'old_stock_weight',
  number: 0,
}, {
  title: '成品库存件数',
  key: 'product_stock_count',
  number: 0,
}, {
  title: '滞销货品件数',
  key: 'unsalable_count',
  number: 0,
}])

const setListArray = (initData: todaySales | TodayInventory, targetList: homeDataListCard[]) => {
  for (const key in initData) {
    const typedKey = key as keyof typeof initData
    targetList.forEach((item) => {
      if (typedKey === item.key) {
        item.number = initData[typedKey]
      }
    })
  }
}
setListArray(todaySaleData.value, todaySaleDataList.value)

setListArray(TodayInventory.value, TodayInventoryList.value)
</script>

<template>
  <div class="grid-12 pb-[120px]!">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <img src="/images/banner/work.png" class="w-[200px]" @click="navigateTo('/staff/list/add')">
      </div>
      <work-card-greet />
      <common-dark />
      <div class="pb-[16px]">
        <div class="blur-bgc rounded-[16px] py-[8px] px-[16px] flex-between items-center">
          <div class="flex-1 dark:color-[#fff]">
            郑州紫金山与二七总店联合经营店
          </div>
          <div class="bg-[#0068FF] py-[10px] px-[16px] rounded-[40px] color-[#fff] flex items-center w-auto">
            <icon name="i-icon:product-toggle" :size="16" /> <div class="pl-[4px]">
              切换门店
            </div>
          </div>
        </div>
      </div>
      <work-card-digitalization left-title="BOSS看板" :list="StorePerformanceList" />
      <work-card-action />
      <work-card-information left-title="本店今日销售" :list="todaySaleDataList" :gold-price="todaySaleData.gold_price" />
      <work-card-information left-title="本店今日库存" :list="TodayInventoryList" />
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>
