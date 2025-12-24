<script setup lang="ts">
useSeoMeta({
  title: '其他收支单列表',
})
const { myStore } = storeToRefs(useStores())
const { getOtherOrderList, otherOrderWhere } = useOtherOrder()
const { total, orderList, filterList, filterListToArray, showtype } = storeToRefs(useOtherOrder())
const { searchPage } = storeToRefs(usePages())
const filterShow = ref(false)
const filterData = ref({} as Partial<otherOrderWhere>)
const tableLoading = ref(false)
await otherOrderWhere()
// 获取列表
const limits = ref(50)

const getList = async (where = {} as Partial<otherOrderWhere>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<otherOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getOtherOrderList(params)
  tableLoading.value = false
}
// 打开高级筛选
const openFilter = () => {
  filterShow.value = true
}
const searchKey = ref('')
const route = useRoute()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<otherOrderWhere>(route.fullPath, filterList.value)
  filterData.value = f
  if (filterData.value.id) {
    searchKey.value = filterData.value.id
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

  await getList(filterData.value as Partial<otherOrderWhere>)
}
// 默认请求列表
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/sale/other/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/**
 高级筛选
 */
const submitWhere = async (f: otherOrderWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}

const resetWhere = async () => {
  filterData.value = {}
  listJump()
}
const searchOrder = async (id: string) => {
  filterData.value.id = id
  filterData.value.searchPage = 1
  listJump()
}
const clearFn = async () => {
  delete filterData.value.id
  searchPage.value = 1
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
  filterData.value.searchPage = 1
  await getList(filterData.value)
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/other/add')
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
  {
    title: '订单编号',
    key: 'id',

  },
  {
    title: '所属门店',
    key: 'store.name',

  },
  { title: '会员手机号', key: 'member.phone', render: (rowData: otherOrderInfo) => {
    return rowData.member.phone || '--'
  } },
  { title: '主销', key: 'clerk.nickname' },
  {
    title: '收支类型',
    render: (rowData: otherOrderInfo) => {
      return filterList.value.type?.preset[rowData.type] || '--'
    },
  },
  {
    title: '收支内容',
    key: 'content',
  },
  {
    title: '收支来源',
    key: 'name',
    render: (rowData: otherOrderInfo) => {
      return filterList.value.source?.preset[rowData.source] || '--'
    },
  },
  {
    title: '收支金额',
    key: 'amount',
  },
  {
    title: '关联销售单',
    key: 'order_id',
    render: (rowData: otherOrderInfo) => {
      return rowData.order_id || '--'
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render: (rowData: otherOrderInfo) => {
      return [h(
        'span',
        {
          type: 'info',
          size: 'small',
          style: {
            color: '#0D6CE4',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/sale/other/add?id=${rowData.id}`)
          },
        },
        { default: () => '详情' },
      )]
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
      :export-level="UserLevel.IdentityShopkeeper"
      placeholder="搜索订单号" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <div class="p-[16px]">
      <common-layout-center>
        <template v-if="showtype === 'list'">
          <template v-if="orderList.length">
            <sale-other-list :info="orderList" :where="filterList" />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-empty text="暂无数据" />
          </template>
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="orderList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </common-layout-center>
    </div>
    <common-create @create="newAdd()" />

    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>

<style lang="scss" scoped>

</style>
