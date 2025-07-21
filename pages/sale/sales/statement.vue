<script setup lang="ts">
// 销售明细列表
useSeoMeta({
  title: '销售明细',
})
const { myStore } = storeToRefs(useStores())
// 获取销售明细列表
const { getStatementList, getStatementWhere } = useStatement()
const { statementList, statementListTotal, filterListToArray, searchPage, filterList } = storeToRefs(useStatement())

const filterData = ref({} as Partial<StatementWhere>)
const filterShow = ref(false)

const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<StatementWhere>) => {
  const params = { page: searchPage.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<orderInfoProducts>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getStatementList(params)
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const submitWhere = async (f: StatementWhere) => {
  filterData.value = { ...filterData.value, ...f }
  statementList.value = []
  searchPage.value = 1
  await getList(filterData.value as any)
  filterShow.value = false
}
const resetWhere = async () => {
  filterData.value = {}
}
await getList()
await getStatementWhere()
// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(async () => {
  height.value = getHeight('header')
})
const searchOrder = async (val: string) => {
  filterData.value = { code: val, store_id: myStore.value.id }
  searchPage.value = 1
  await getList(filterData.value)
}

const clearFn = async () => {
  filterData.value = {}
  statementList.value = []
  searchPage.value = 1
  await getList()
}
const updatePage = async () => {
  await getList(filterData.value as otherOrderWhere)
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
            placeholder="搜索编号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 py-[16px]">
          <div class="text-size-[14px] color-[#fff]">
            共{{ statementListTotal }}条数据
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
          <template v-if="statementList.length">
            <sale-statement-sales :info="statementList" :where="filterList" />
            <common-page v-model:page="searchPage" :total="statementListTotal" :limit="12" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </div>
    </div>
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere">
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
