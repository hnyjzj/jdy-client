<script setup lang="ts">
useSeoMeta({
  title: '订金单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()

const { filterListToArray, OrdersList, total, filterList, searchPage } = storeToRefs(useDepositOrder())
const { getSaleWhere, getDepositList, isStoreStaff } = useDepositOrder()
const filterData = ref({} as Partial<DepositOrderWhere>)
const filterShow = ref(false)
const limits = ref(12)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<DepositOrderInfo>) => {
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<DepositOrderInfo>
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
const isStaff = async () => {
  return await isStoreStaff({ id: myStore.value.id }) || false
}

const submitWhere = async (f: DepositOrderWhere) => {
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

const changeStores = async () => {
  await getList()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/deposit/add')
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
            <sale-deposit-list :info="OrdersList" :where="filterList" :is-store-staff="isStaff" @user-click="handleClick" />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
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

          @focus="(e) => {
            focus(e)
            getStoreStaffList({ id: myStore.id })
          }"
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

          @focus="(e) => {
            focus(e)
            getStoreStaffList({ id: myStore.id })
          }"
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
    </common-filter-where>
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
