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
const { filterListToArray, OrdersList, total, filterList, showtype } = storeToRefs(useOrder())
const { searchPage } = storeToRefs(usePages())
const { getSaleWhere, getOrderList, revokedOrder, payOrder, getOrderListAll } = useOrder()
const filterData = ref({} as Partial<OrderWhere>)
const filterShow = ref(false)

const getSaleman = async () => {
  if (!myStore.value.id)
    return
  await getStoreStaffList({ id: myStore.value.id })
}

const limits = ref(50)
const tableLoading = ref(false)
// 获取列表
const getList = async (where = {} as Partial<OrderWhere>) => {
  tableLoading.value = true

  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<OrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  await getOrderList(params)
  tableLoading.value = false
}

// 打开高级筛选
const openFilter = () => {
  getSaleman()
  // 打开筛选
  filterShow.value = true
}
const searchKey = ref('')
const route = useRoute()
// 获取where 条件
await getSaleWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<OrderWhere>(route.fullPath, filterList.value)
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

  await getList(filterData.value as Partial<OrderInfo>)
}
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/sale/sales/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
// 高级筛选确定
const submitWhere = async (f: OrderWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}
// 重置高级筛选
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

const searchProduct = async (e: string) => {
  if (e.length > 0) {
    await getFinishedList({ page: 1, limit: 5, where: { name: e } })
  }
}

const searchOrder = async (id: string) => {
  filterData.value.id = id
  filterData.value.searchPage = 1
  listJump()
}
const clearFn = async () => {
  delete filterData.value.id
  filterData.value.searchPage = 1
  listJump()
}

const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
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
  filterData.value.searchPage = 1
  await getList(filterData.value)
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/sales/add')
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
    title: '订单状态',
    key: 'id',
    render: (rowData: OrderInfo) => {
      return filterList.value.status?.preset[rowData.status] || '--'
    },
  },
  {
    title: '所属门店',
    key: 'store.name',
  },
  {
    title: '会员手机号',
    key: 'member.phone',
  },
  {
    title: '主销',
    key: 'age',
    render: (rowData: OrderInfo) => {
      return rowData.clerks.find((ele: OrderSalesClerks) => ele.is_main)?.salesman?.nickname
    },
  },
  {
    title: '货品信息',
    render: (rowData: OrderInfo) => {
      return rowData.products[0]?.finished.product?.name || '--'
    },
  },
  {
    title: '实付金额',
    key: 'price_pay',
  },
  {
    title: '货品金额',
    key: 'product_finished_price',
  },
  {
    title: '优惠金额',
    key: 'price_discount',
  },
  {
    title: '旧料抵扣',
    key: 'product_old_price',
  },
  {
    title: '积分',
    key: 'integral',
  },
  {
    title: '销售时间',
    key: 'age',
    render: (rowData: OrderInfo) => {
      return formatISODate(rowData.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render: (rowData: OrderInfo) => {
      return h(
        'span',
        {
          style: {
            color: '#0D6CE4',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
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

const exportExcel = async () => {
  const res = await getOrderListAll({ all: true, where: filterData.value })
  exportSalesOrderListToXlsx(res, [
    ...filterListToArray.value,
  ], '销售单列表', [])
}
</script>

<template>
  <div>
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="total"
      placeholder="搜索订单号"
      :is-export="true"
      @export="exportExcel" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <common-layout-center>
      <div class="p-4">
        <template v-if="showtype === 'list'">
          <div>
            <template v-if="OrdersList.length">
              <sale-sales-list :info="OrdersList" :where="filterList" @cancle="cancelOrder" @pay="payOrderConfirm" />
              <common-page
                v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
            </template>
            <template v-else>
              <common-empty text="暂无数据" />
            </template>
          </div>
        </template>
        <template v-if="showtype === 'table'">
          <template v-if="OrdersList.length">
            <common-datatable :columns="cols" :list="OrdersList" :page-option="pageOption" :loading="tableLoading" />
          </template>
          <template v-else>
            <common-empty text="暂无数据" />
          </template>
        </template>
      </div>
    </common-layout-center>
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
          size="large"
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
          size="large"
          clearable
          remote
          @focus="getSaleman"
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
          size="large"
          clearable
          remote
          @search="searchProduct"
          @focus="focus"
        />
      </template>
    </common-filter-where>
    <common-create @create="newAdd" />
  </div>
</template>

<style lang="scss" scoped>

</style>
