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
const limits = ref(50)
const tableLoading = ref(false)

// 获取列表
const getList = async (where = {} as Partial<StatementWhere>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<orderInfoProducts>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getStatementList(params)
  tableLoading.value = false
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const listJump = () => {
  const url = UrlAndParams('/sale/sales/statement', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
const searchKey = ref('')
const route = useRoute()
// 获取where 条件
await getStatementWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<StatementWhere>(route.fullPath, filterList.value)
  filterData.value = f
  if (filterData.value.code) {
    searchKey.value = filterData.value.code
  }
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage) || 1
  }
  if (f.limits) {
    limits.value = Number(f.limits) || 50
  }

  await getList(filterData.value as Partial<StatementWhere>)
}
// 默认请求列表
await handleQueryParams()

const submitWhere = async (f: StatementWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}
// 切换卡片
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}

const searchOrder = async (code: string) => {
  filterData.value.code = code
  filterData.value.searchPage = 1
  listJump()
}

const clearFn = async () => {
  delete filterData.value.code
  searchKey.value = ''
  filterData.value.searchPage = 1
  listJump()
}
const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

const changeStores = async () => {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  { title: '订单编号', key: 'id' },
  { title: '订单状态', key: 'id', render: (rowData: orderInfoProducts) => {
    return filterList.value.status?.preset[rowData.status] || '--'
  } },
  { title: '关联销售单', key: 'order_id' },
  {
    title: '所属门店',
    key: 'store.name',
  },
  { title: '会员手机', key: 'member.phone' },
  { title: '导购', key: '', render: (rowData: orderInfoProducts) => {
    return rowData.order?.clerks[0].salesman?.nickname || '--'
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
      if (rowData.type === 1) {
        return rowData.finished.product?.name || '--'
      }
      else if (rowData.type === 2) {
        return rowData.old?.product?.name || '--'
      }
      else {
        return rowData.accessorie?.product?.category?.name || '--'
      }
    },
  },
  {
    title: '标签价',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === 1) {
        return rowData.finished.product?.label_price || '--'
      }
      else if (rowData.type === 2) {
        return rowData.old?.product?.label_price || '--'
      }
      else {
        return rowData.accessorie?.product?.category?.label_price || '--'
      }
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
            if (!rowData.order_id)
              return
            navigateTo(`/sale/sales/order?id=${rowData.order_id}`)
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
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="total"
      placeholder="搜索产品条码" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <template v-if="showtype === 'list'">
      <common-layout-center>
        <div class="p-[16px]">
          <template v-if="statementList.length">
            <sale-statement-sales :info="statementList" :where="filterList" />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </common-layout-center>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="statementList" :page-option="pageOption" :loading="tableLoading" />
    </template>

    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #order_id>
        <n-input v-model:value="filterData.order_id" placeholder="请输入销售单订单号" clearable size="large" />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>
