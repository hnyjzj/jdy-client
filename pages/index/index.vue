<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

interface DemoItem { title: string, number: number }
const { StorePerformance, myStoreTadaySale } = homeDataStore()
const { StorePerformanceList, todaySaleData } = storeToRefs(homeDataStore())
const { myStore } = storeToRefs(useStores())
const demoList = ref<DemoItem[]>([
  { title: '销售金额', number: 100 },
  { title: '销售件数', number: 100 },
  { title: '旧货抵扣', number: 100 },
  { title: '退货金额', number: 100 },
])

await StorePerformance({ duration: 'today' })
await myStoreTadaySale({ store_id: myStore.value.id })
const todaySaleDataList = ref<{ title: string, key: string, number: number | string }[]>([{
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
for (const key in todaySaleData.value) {
  const typedKey = key as keyof typeof todaySaleData.value
  todaySaleDataList.value.forEach((item) => {
    if (typedKey === item.key) {
      item.number = todaySaleData.value[typedKey]
    }
  })
}

const demoListt = ref<DemoItem[]>([{ title: '销售金额', number: 100 }, { title: '销售金额', number: 100 }, { title: '销售件数', number: 100 }, { title: '旧货抵扣', number: 100 }, { title: '退货金额', number: 100 }])
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
      <work-card-information left-title="销售目标" :list="demoList" />
      <work-card-information left-title="今日销售" :list="demoList" />
      <work-card-information left-title="会员数据" rb-text="查看员工排行" :list="demoListt" />
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>
