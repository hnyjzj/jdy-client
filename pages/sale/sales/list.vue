<script setup lang="ts">
// 销售单列表页
useSeoMeta({
  title: '销售单列表',
})
const { $toast } = useNuxtApp()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getFinishedList } = useFinished()
const { finishedList } = storeToRefs(useFinished())
const { filterListToArray, OrdersList, total, filterList, searchPage } = storeToRefs(useOrder())
const { getSaleWhere, getOrderList, revokedOrder, payOrder } = useOrder()
const filterData = ref({} as Partial<OrderWhere>)
const filterShow = ref(false)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })
const limit = ref(12)
// 获取列表
const getList = async (where = {} as Partial<OrderInfo>) => {
  const params = { page: searchPage.value, limit: limit.value, where: { store_id: myStore.value.id } } as ReqList<OrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getOrderList(params)
}

// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}

const submitWhere = async (f: OrderWhere) => {
  filterData.value = { ...filterData.value, ...f }

  OrdersList.value = []
  searchPage.value = 1
  await getList(filterData.value as any)
  filterShow.value = false
}
const resetWhere = async () => {
  filterData.value = {}
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
    await getFinishedList({ page: 1, limit: 5, where: { name: e } })
  }
}

const searchOrder = async (id: string) => {
  filterData.value = { id, store_id: myStore.value.id }
  searchPage.value = 1
  await getList(filterData.value)
}
const clearFn = async () => {
  filterData.value = {}
  OrdersList.value = []
  searchPage.value = 1
  await getList()
}

const updatePage = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 撤销订单
const cancelOrder = async (id: string) => {
  const res = await revokedOrder({ id })
  if (res) {
    $toast.success('撤销成功')
    await getList()
  }
  else {
    $toast.error('撤销失败')
  }
}
// 支付订单确认完成
const payOrderConfirm = async (id: string) => {
  const res = await payOrder({ id })
  if (res) {
    $toast.success('支付成功')
    await getList()
  }
  else {
    $toast.error('支付失败')
  }
}
const changeStores = async () => {
  await getList()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/sales/add')
}

const getSaleman = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res?.data.value?.code === HttpCode.ERROR) {
    $toast.error(res?.data.value?.message || '请求失败')
  }
}
</script>

<template>
  <div>
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="changeStores" />
          <product-filter-search
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 py-[16px]">
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
          <template v-if="OrdersList.length">
            <sale-sales-list :info="OrdersList" :where="filterList" @cancle="cancelOrder" @pay="payOrderConfirm" />
            <common-page v-model:page="searchPage" :total="total" :limit="limit" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </div>
    </div>
    <!-- filter -->
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #cashier_id>
        <n-select
          v-model:value="filterData.cashier_id"
          placeholder="请选择收银员"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="getSaleman"
        />
      </template>
      <template #salesman_id>
        <n-select
          v-model:value="filterData.salesman_id"
          placeholder="请选择导购员"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="getSaleman"
        />
      </template>
      <template #member_id>
        <n-select
          v-model:value="filterData.member_id"
          filterable
          placeholder="请选择会员"
          :options="memberList.map(v => ({
            label: `${v.phone} (${v.nickname ? v.nickname : v.name})`,
            value: v.id,
          }))"
          clearable
          remote
          @search="getMember"
          @focus="focus"
        />
      </template>

      <template #product_id>
        <n-select
          v-model:value="filterData.product_id"
          filterable
          placeholder="输入商品名称"
          :options="finishedList.map(v => ({
            label: v.name,
            value: v.id,
          }))"
          clearable
          remote
          @search="searchProduct"
          @focus="focus"
        />
      </template>
    </common-filter-where>
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
