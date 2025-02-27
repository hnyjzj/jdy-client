<script setup lang="ts">
// 销售单列表页

useSeoMeta({
  title: '销售单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getProductList } = useProductManage()
const { productList } = storeToRefs(useProductManage())
const { filterListToArray, OrdersList, total, filterList, searchPage } = storeToRefs(useOrder())
const { getSaleWhere, getOrderList } = useOrder()
const filterData = ref({} as Partial<OrderWhere>)
const filterShow = ref(false)

// 搜索条件 页码
// const searchPage = ref<number>(1)

// 获取列表
const getList = async (where = {} as Partial<Orders>) => {
  const params = { page: searchPage.value, limit: 12 } as ReqList<Orders>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getOrderList(params)
}
const handleClick = async (id: string) => {
  navigateTo(`/sale/sales/order?id=${id}`)
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const submitWhere = async (f: OrderWhere) => {
  filterData.value = f
  OrdersList.value = []

  searchPage.value = 1
  await getList(filterData.value as any)
}

await getList()
await getSaleWhere()
// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(async () => {
  height.value = getHeight('header')
})
const searchProduct = async (e: string) => {
  if (e.length > 0) {
    await getProductList({ page: 1, limit: 5, where: { name: e } })
  }
}

const searchOrder = async (e: string) => {
  await getOrderList({ page: 1, limit: 5, where: { id: e } })
}
const clearFn = async () => {
  OrdersList.value = []

  searchPage.value = 1
  await getList()
}
const pageCount = computed(() => {
  return Math.ceil(total.value / 12)
})

const goTop = () => {
  document.documentElement.scrollIntoView({

    block: 'start',
  })
}
const updatePage = async (page: number) => {
  await goTop()

  searchPage.value = page
  await getList()
}
</script>

<template>
  <div>
    <!-- bg-gradient-linear-[180deg,#3875C5,#467EC9] -->
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" />
          <product-filter-search
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 pt-[12px] pb-[16px]">
          <div class="text-size-[14px] color-[#fff]">
            共{{ total }}条数据
          </div>
          <div @click="openFilter()">
            <product-filter-senior class="color-[#fff]" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid-12">
      <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="p-[16px]">
          <sale-sales-list :info="OrdersList" :where="filterList" @user-click="handleClick" />
          <div class="py-[16px] flex-center-row">
            <n-pagination
              v-model:page="searchPage"
              :style="{
                '--n-item-text-color-active': '#4678B9',
                '--n-item-border-active': '1px solid #2976EF',
                '--n-item-text-color-hover': '#333',
              }" :page-count="pageCount"
              :page-slot="6"

              size="large"
              @update:page="updatePage"
            />
          </div>
        </div>
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
      <template #product_id>
        <n-select
          v-model:value="filterData.product_id"
          filterable
          placeholder="输入商品名称"
          :options="productList.map(v => ({
            label: v.name,
            value: v.id,
          }))"
          clearable
          remote
          @search="searchProduct"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>
