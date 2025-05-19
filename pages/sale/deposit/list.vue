<script setup lang="ts">
useSeoMeta({
  title: '定金单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()

const { filterListToArray, OrdersList, total, filterList, searchPage } = storeToRefs(useDepositOrder())
const { getSaleWhere, getDepositList, payDepositOrder, rovkeDepositOrder } = useDepositOrder()
const filterData = ref({} as Partial<DepositOrderWhere>)
const filterShow = ref(false)

const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<OrderInfo>) => {
  const params = { page: searchPage.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<OrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getDepositList(params)
}
const handleClick = async (id: string) => {
  navigateTo(`/sale/sales/order?id=${id}`)
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}

const submitWhere = async (f: DepositOrderWhere) => {
  filterData.value = { ...filterData.value, ...f }
  OrdersList.value = []
  searchPage.value = 1
  await getList(filterData.value as any)
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

const searchOrder = async (id: string) => {
  await getDepositList({ page: 1, limit: 5, where: { id, store_id: myStore.value.id } })
}
const clearFn = async () => {
  OrdersList.value = []
  searchPage.value = 1
  await getList()
}

const updatePage = async (page: number) => {
  searchPage.value = page
  await getList()
}
const { $toast } = useNuxtApp()

const payDialog = ref(false)
const payId = ref('')
const submitPay = async () => {
  const res = await payDepositOrder({ id: payId.value })
  if (res) {
    $toast.success('支付成功')
  }
  else {
    $toast.error('支付失败')
  }
  await getList()
  return res
}

const payOrder = async (val: string) => {
  payId.value = val
  payDialog.value = true
}

const cancelDialog = ref(false)
const cancelId = ref('')
const cancelOrder = async (val: string) => {
  cancelId.value = val
  cancelDialog.value = true
}
const submitCancel = async () => {
  const res = await rovkeDepositOrder({ id: cancelId.value })
  if (res) {
    $toast.success('支付成功')
  }
  else {
    $toast.error('支付失败')
  }
  await getList()
  return res
}
const changeStores = async () => {
  await getList()
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
          <template v-if="OrdersList.length">
            <sale-deposit-list :info="OrdersList" :where="filterList" :pay-order="payOrder" :cancel-order="cancelOrder" @user-click="handleClick" />
            <common-page v-model:page="searchPage" :total="total" :limit="12" @update:page="updatePage" />
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
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
        />
      </template>
      <template #clerk_id>
        <n-select
          v-model:value="filterData.clerk_id"
          placeholder="请选择导购员"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
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
        />
      </template>
    </common-filter-where>

    <common-confirm v-model:show="payDialog" icon="success" title="支付提示" text="确认要完成支付吗?" @submit="submitPay" />
    <common-confirm v-model:show="cancelDialog" icon="error" title="撤销提示" text="确认撤销此订金单吗?" @submit="submitCancel" />
  </div>
</template>

<style lang="scss" scoped>

</style>
