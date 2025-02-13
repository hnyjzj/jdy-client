<script setup lang="ts">
// 销售单列表页

useSeoMeta({
  title: '销售单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())

const { getStoreStaffList } = useStores()
const { filterListToArray, OrdersList, total, OrderDetail } = storeToRefs(useOrder())
const { getSaleWhere, getOrderList, getOrderDetail } = useOrder()
const filterData = ref({} as Partial<OrderWhere>)
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
const handleClick = async (id: string) => {
  await getOrderDetail({ id })
  // 跳转到详情页
  showOrder.value = true
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const submitWhere = async (f: OrderWhere) => {
  filterData.value = f
  OrdersList.value = []
  nomore.value = false
  searchPage.value = 1
  await getList(filterData.value)
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
        <div id="header" class="px-[16px] pt-[16px] w-full ">
          <div class="flex flex-row gap-2">
            <product-manage-company class="color-[#fff]" />
            <product-filter-search class="color-[#fff] flex-1" />
          </div>
          <div class="flex-center-between gap-2">
            <div class="text-size-[14px] color-[#fff]">
              共{{ total }}条数据
            </div>
            <div @click="openFilter()">
              <product-filter-senior class="color-[#fff]" />
            </div>
          </div>
        </div>
        <!-- list -->
        <common-list-pull
          v-model:info-show="showOrder"
          :distance="height"
          :nomore="nomore"
          @pull="() => {
            searchPage += 1
            getList()
          }">
          <!-- card -->
          <sale-sales-list :info="OrdersList" @user-click="handleClick" />
          <template #info>
            <!-- info -->
            <sale-order-detail :orders="OrderDetail" />
          </template>
          <template #footer>
            <!-- actions -->
            <div class="grid-12 gap-[12px] px-[16px]">
              <div class="col-6" uno-sm="col-4 offset-2">
                <common-button-rounded content="取消" bgc="#fff" color="#000" @button-click="showOrder = false" />
              </div>
              <div class="col-6" uno-sm="col-4 offset6">
                <common-button-rounded content="确定" @button-click="showOrder = false" />
              </div>
            </div>
          </template>
        </common-list-pull>
      </div>
    </div>
    <!-- filter -->
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere">
      <template #cashier_id>
        <n-select
          v-model:value="filterData.cashier_id"
          placeholder="请输入收银员"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
        />
      </template>
      <template #salesman_id>
        <n-select
          v-model:value="filterData.salesman_id"
          placeholder="请选择"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>
