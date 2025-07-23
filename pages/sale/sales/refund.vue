<script setup lang="ts">
// 销售明细列表
useSeoMeta({
  title: '退货明细',
})
const { myStore } = storeToRefs(useStores())
// 获取销售明细列表
const { getReturnList, getReturnWhere } = useStatement()
const { statementReturnList, statementRetrunListTotal, ReturnfilterListToArray, ReturnfilterList } = storeToRefs(useStatement())
const { searchPage } = storeToRefs(usePages())

const filterData = ref({} as Partial<StatementRefundWhere>)
const filterShow = ref(false)

const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<StatementRefundWhere>) => {
  const params = { page: searchPage.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<StatementRefundInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getReturnList(params)
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const submitWhere = async (f: StatementRefundWhere) => {
  filterData.value = { ...filterData.value, ...f }
  statementReturnList.value = []
  searchPage.value = 1
  await getList(filterData.value as any)
}
const resetWhere = async () => {
  filterData.value = {}
}
await getList()
await getReturnWhere()
// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(async () => {
  height.value = getHeight('header')
})
const searchOrder = async (id: string) => {
  await getReturnList({ page: 1, limit: 5, where: { id, store_id: myStore.value.id } })
}
const clearFn = async () => {
  statementReturnList.value = []
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
</script>

<template>
  <div>
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="changeStores" />
          <product-filter-search
            placeholder="搜索退货单编号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 py-[16px]">
          <div class="text-size-[14px] color-[#fff]">
            共{{ statementRetrunListTotal }}条数据
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
          <template v-if="statementReturnList.length">
            <sale-statement-return :info="statementReturnList" :where="ReturnfilterList" />
            <common-page v-model:page="searchPage" :total="statementRetrunListTotal" :limit="12" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </div>
    </div>
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="ReturnfilterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #order_id>
        <n-input v-model:value="filterData.order_id" placeholder="请输入订单号" clearable size="large" />
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
  </div>
</template>

<style lang="scss" scoped>

</style>
