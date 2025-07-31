<script setup lang="ts">
// 销售明细列表
useSeoMeta({
  title: '退货明细',
})
const { myStore } = storeToRefs(useStores())
// 获取销售明细列表
const { getReturnList, getReturnWhere } = useStatement()
const { statementReturnList, statementRetrunListTotal, ReturnfilterListToArray, ReturnfilterList, showtype } = storeToRefs(useStatement())
const { searchPage } = storeToRefs(usePages())

const filterData = ref({} as Partial<StatementRefundWhere>)
const filterShow = ref(false)
const limits = ref(50)
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
const searchKey = ref('')
const route = useRoute()
await getReturnWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<StatementRefundWhere>(route.fullPath, ReturnfilterList.value)
  filterData.value = f
  if (filterData.value.code) {
    searchKey.value = filterData.value.code
  }
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage)
  }
  if (f.limits) {
    limits.value = Number(f.limits)
  }

  await getList(filterData.value as Partial<StatementRefundWhere>)
}
// 默认请求列表
await handleQueryParams()

const listJump = () => {
  const url = UrlAndParams('/sale/sales/refund', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

const submitWhere = async (f: StatementRefundWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}

const searchOrder = async (code: string) => {
  filterData.value.code = code
  filterData.value.searchPage = 1
  listJump()
}
const clearFn = async () => {
  delete filterData.value.code
  filterData.value.searchPage = 1
  listJump()
}
const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

// 切换卡片
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}
const changeStores = async () => {
  await getList(filterData.value)
}
</script>

<template>
  <div>
    <product-filter
      v-model:search-key="searchKey"
      :product-list-total="statementRetrunListTotal"
      placeholder="搜索退货单编号" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <common-layout-center>
      <div class="p-[16px]">
        <template v-if="statementReturnList.length">
          <sale-statement-return :info="statementReturnList" :where="ReturnfilterList" />
          <common-page v-model:page="searchPage" :total="statementRetrunListTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <common-emptys text="暂无数据" />
        </template>
      </div>
    </common-layout-center>
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="ReturnfilterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #order_id>
        <n-input v-model:value="filterData.order_id" placeholder="请输入订单号" clearable size="large" />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>
