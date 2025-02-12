<script setup lang="ts">
// 销售单列表页

useSeoMeta({
  title: '销售单列表',
})

const { filterListToArray, OrdersList, total } = storeToRefs(useOrder())
const { getSaleWhere, getOrderList } = useOrder()
const filterData = ref({} as Partial<Orders>)
const filterShow = ref(false)

// 搜索条件 页码
const searchPage = ref<number>(1)
// 是否有更多数据
const nomore = ref<boolean>(false)
// 获取列表
const getList = async (where = {} as Partial<Orders>) => {
  if (nomore.value)
    return
  const params = { page: searchPage.value, limit: 12 } as ReqList<Orders>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getOrderList(params)
  res ? nomore.value = false : nomore.value = true
}
const showOrder = ref(false)
const handleClick = async () => {
// 跳转到详情页
  showOrder.value = true
//   await navigateTo({ path: '/sale/sales/order', query: {
//     id,
//   } })
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const submitWhere = () => {

}

await getList()
await getSaleWhere()
// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(async () => {
  height.value = getHeight('header')
})
</script>

<template>
  <div>
    <div class="grid-12">
      <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <!-- header -->
        <div id="header" class="px-[16px] pt-[16px] w-full z-1 sticky top-0 bg-[#E6E6E8]">
          <div class="flex flex-row gap-2">
            <product-manage-company class="color-[#fff]" />
            <product-filter-search class="color-[#fff] flex-1" />
          </div>
          <!-- data -->
          <div class="flex-center-between gap-2">
            <div class="text-size-[14px] color-[#fff]">
              共{{ total }}条数据
            </div>
            <div @click="openFilter()">
              <product-filter-senior class="color-[#fff]" />
            </div>
          </div>
        </div>
        <!-- cards -->
        <common-list-pull
          :distance="height"
          :nomore="nomore"
          @pull="() => {
            searchPage += 1
            getList()
          }">
          <sale-sales-list :info="OrdersList" @user-click="handleClick" />
        </common-list-pull>
        <div class="px-[16px]">
          <!-- <sale-sales-list :info="OrdersList" @user-click="handleClick" /> -->
        </div>
      </div>
    </div>
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />
    <n-drawer v-model:show="showOrder" width="90%">
      <n-drawer-content title="斯通纳" closable>
        《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="scss" scoped>

</style>
