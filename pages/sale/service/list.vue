<script setup lang="ts">
import { useCascaderAreaData } from '@vant/area-data'
// 维修单列表
useSeoMeta({
  title: '维修单列表',
})
const areaoptions = useCascaderAreaData()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getRepairOrderWhere, getRepairOrderList, cancelRepairOrder, payRepairOrder } = useRepair()
const { repairOrderList, Total, repairFilterList, searchPage, repairFilterListToArray } = storeToRefs(useRepair())
const filterData = ref({} as Partial<service>)
const filterShow = ref(false)

const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => {
  if (val.length === 11) {
    await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })
  }
}

const cancelOrder = async (id: string) => {
  return await cancelRepairOrder({ id })
}
const payOrder = async (id: string) => {
  return await payRepairOrder({ id })
}

// 获取列表
const getList = async (where = {} as Partial<OrderInfo>) => {
  const params = { page: searchPage.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<OrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getRepairOrderList(params)
}
const handleClick = async (id: string) => {
  navigateTo(`/sale/sales/order?id=${id}`)
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}

const submitWhere = async (f: service) => {
  filterData.value = { ...filterData.value, ...f }
  repairOrderList.value = []
  searchPage.value = 1
  await getList(filterData.value as any)
}
const resetWhere = async () => {
  filterData.value = {}
}
await getList()

await getRepairOrderWhere()

const searchOrder = async (id: string) => {
  await getRepairOrderList({ page: 1, limit: 5, where: { id, store_id: myStore.value.id } })
}
const clearFn = async () => {
  repairOrderList.value = []
  searchPage.value = 1
  await getList()
}

const updatePage = async (page: number) => {
  searchPage.value = page
  await getList()
}

const changeStores = async () => {
  await getList()
}
const Key = ref()
const cityOptions = ref<any>([])
const areaOptions = ref<any>([])
const setNowProvince = () => {
  filterData.value.city = undefined
  filterData.value.area = undefined
  cityOptions.value = [...areaoptions.filter(item => item.value === filterData.value.province)]
  cityOptions.value = cityOptions.value[0].children
  Key.value = new Date().getTime().toString()
}

const setNowcity = () => {
  filterData.value.area = undefined
  areaOptions.value = [...cityOptions.value.filter((item: any) => item.value === filterData.value.city)]
  areaOptions.value = areaOptions.value[0].children
  Key.value = new Date().getTime().toString()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/service/add')
}
</script>

<template>
  <div>
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="changeStores()" />
          <product-filter-search
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 py-[16px]">
          <div class="text-size-[14px] color-[#fff]">
            共{{ Total }}条数据
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
          <template v-if="repairOrderList.length">
            <sale-service-list
              :list="repairOrderList"
              :cancel-order="cancelOrder"
              :pay-order="payOrder"
              :where="repairFilterList"
              :get-list="getList"
              @user-click="handleClick"
            />
            <common-page v-model:page="searchPage" :total="Total" :limit="12" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </div>
    </div>
    <!-- filter -->
    <div>
      <common-filter-where v-model:show="filterShow" :data="filterData" :filter="repairFilterListToArray" @submit="submitWhere" @reset="resetWhere">
        <template #receptionist_id>
          <n-select
            v-model:value="filterData.receptionist_id"
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
        <template #province>
          <n-select
            v-model:value="filterData.province"
            filterable
            placeholder="请选择省份"
            :options="areaoptions.map(v => ({
              label: v.text,
              value: v.value,
            }))"
            clearable
            remote
            @update:value="setNowProvince"
            @focus="focus"
          />
        </template>
        <template #city>
          <div :key="Key">
            <n-select
              v-model:value="filterData.city"
              filterable
              placeholder="请选择城市"
              :options="cityOptions.map((v:any) => ({
                label: v.text,
                value: v.value,
              }))"
              clearable
              remote
              @update:value="setNowcity"
              @focus="focus"
            />
          </div>
        </template>
        <template #area>
          <div :key="Key">
            <n-select
              v-model:value="filterData.area"
              filterable
              placeholder="请选择省份"
              :options="areaOptions.map((v:any) => ({
                label: v.text,
                value: v.value,
              }))"
              clearable
              remote
              @focus="focus"
            />
          </div>
        </template>
      </common-filter-where>
    </div>
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
