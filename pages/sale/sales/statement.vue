<script setup lang="ts">
// 销售明细列表
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '销售明细',
})
const { myStore } = storeToRefs(useStores())
// 获取销售明细列表
const { getStatementList, getStatementWhere } = useStatement()
const { statementList, total, filterListToArray, filterList, showtype } = storeToRefs(useStatement())
const { searchPage } = storeToRefs(usePages())
const filterData = ref({} as Partial<StatementWhere>)
const filterShow = ref(false)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const limits = ref(50)
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<StatementWhere>) => {
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<orderInfoProducts>
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
const updatePage = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value as otherOrderWhere)
}
const changeStores = async () => {
  await getList()
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const returnType = (number: number) => {
  if (number === 1) {
    return '成品'
  }
  if (number === 2) {
    return '旧料'
  }
  return '配件'
}
const cols = [
  { title: '编号', key: 'id' },
  { title: '关联销售单', key: 'order_id' },
  {
    title: '所属门店',
    key: 'store.name',
  },
  { title: '会员', key: 'member.name' },
  { title: '会员手机', key: 'member.phone' },
  { title: '导购', key: '', render: (rowData: orderInfoProducts) => {
    return rowData.order?.clerks[0].salesman?.nickname
  } },

  {
    title: '产品类型',
    render: (rowData: orderInfoProducts) => {
      return returnType(rowData.type)
    },
  },
  {
    title: '产品名称',
    render: (rowData: orderInfoProducts) => {
      return rowData.type === 1 ? rowData.finished.product?.name : rowData.type === 2 ? rowData.old?.product?.name : rowData.accessorie?.product?.category?.name
    },
  },
  {
    title: '标签价',
    render: (rowData: orderInfoProducts) => {
      return rowData.type === 1 ? rowData.finished.product?.label_price : rowData.type === 2 ? rowData.old?.product?.label_price : rowData.accessorie?.product?.category?.label_price
    },
  },
  {
    title: '应付金额',
    key: 'order.price',
  },

  {
    title: '折扣',
    key: 'order.price_discount',
  },
  {
    title: '积分',
    key: 'order.integral',
  },
  {
    title: '操作',
    key: 'action',
    render: (rowData: orderInfoProducts) => {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/sale/sales/order?id=${rowData.id}`)
          },
        },
        { default: () => '查看详情' },
      )
    },
  },
]
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
        <common-tool-list v-model="showtype" :total="total" @height="openFilter" />
      </div>
    </div>

    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="statementList.length">
              <sale-statement-sales :info="statementList" :where="filterList" />
              <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
            </template>
            <template v-else>
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="statementList" :page-option="pageOption" />
    </template>

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
