<script lang="ts" setup>
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
  <div class="grid-12">
    <div class="p-[16px] col-12" uno-md="col-8 offset-2">
      <work-card-digitalization left-title="BOSS看板" :list="StorePerformanceList" />
      <work-card-information left-title="本店今日销售" :list="todaySaleDataList" :gold-price="todaySaleData.gold_price" />
      <work-card-information left-title="本店今日库存" :list="TodayInventoryList" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
