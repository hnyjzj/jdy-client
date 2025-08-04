<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '订金单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { filterListToArray, OrdersList, total, filterList, showtype } = storeToRefs(useDepositOrder())
const { searchPage } = storeToRefs(usePages())
const { getSaleWhere, getDepositList, isStoreStaff } = useDepositOrder()
const filterData = ref({} as Partial<DepositOrderWhere>)
const filterShow = ref(false)
const limits = ref(50)

const tableLoading = ref(false)
const { $toast } = useNuxtApp()
const getSaleman = async () => {
  if (!myStore.value.id)
    return
  await getStoreStaffList({ id: myStore.value.id })
}

// 获取列表
const getList = async (where = {} as Partial<DepositOrderWhere>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<DepositOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getDepositList(params)
  tableLoading.value = false
}

// 打开高级筛选
const openFilter = () => {
  getSaleman()
  // 打开筛选
  filterShow.value = true
}
const isStaff = async () => {
  return await isStoreStaff({ id: myStore.value.id }) || false
}

const searchKey = ref('')
const route = useRoute()
// 获取where 条件
await getSaleWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<DepositOrderWhere>(route.fullPath, filterList.value)
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
  await getList(filterData.value as Partial<DepositOrderWhere>)
}
// 默认请求列表
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/sale/deposit/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
const submitWhere = async (f: DepositOrderWhere) => {
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

const changeStores = async () => {
  filterData.value = {}
  listJump()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/deposit/add')
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 200, 300],
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
    key: 'member.nickname',
    render: (rowData: DepositOrderInfo) => {
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
    key: 'clerk.nickname',
  },

  {
    title: '定金金额',
    key: 'price',
  },
  {
    title: '货品',
    key: 'price',
    render: (rowData: DepositOrderInfo) => {
      return rowData.products?.map((item) => {
        return item.is_our ? item.product_finished.name : item.product_demand?.name
      }).join(',') || '--'
    },
  },
  {
    title: '销售时间',
    key: 'age',
    render: (rowData: DepositOrderInfo) => {
      return formatISODate(rowData.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    render: (rowData: DepositOrderInfo) => {
      const result = [h(
        NButton,
        {
          type: 'info',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/sale/deposit/order?id=${rowData.id}`)
          },
        },
        { default: () => '查看详情' },
      )]
      if (rowData.status === DepositOrderStatus.Booking) {
        result.push(h(
          NButton,
          {
            type: 'info',
            size: 'small',
            class: 'mr-[4px]',
            onClick: async () => {
              if (!rowData.id) {
                return
              }
              const res = await isStaff()
              if (!res) {
                $toast.error('未入职门店无法操作')
                return
              }
              navigateTo(`/sale/sales/add?id=${rowData.id}`)
            },
          },
          { default: () => '开单' },
        ))
      }
      if (rowData?.order_sales?.length) {
        result.push(h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            class: 'mr-[4px]',
            onClick: () => {
              if (!rowData.id)
                return
              navigateTo(`/sale/sales/order?id=${rowData.order_sales[0].id}`)
            },
          },
          { default: () => '销售单' },
        ))
      }
      return result
    },
  },
]
</script>

<template>
  <div>
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey" :product-list-total="total"
      placeholder="搜索订单号" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>

    <template v-if="showtype === 'list'">
      <common-layout-center>
        <div class="p-[16px] ">
          <template v-if="OrdersList.length">
            <sale-deposit-list :info="OrdersList" :where="filterList" :is-store-staff="isStaff" />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </common-layout-center>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="OrdersList" :page-option="pageOption" :loading="tableLoading" />
    </template>
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
          size="large"
          @focus="getSaleman"
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
          size="large"
          @focus="getSaleman"
        />
      </template>
    </common-filter-where>
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
