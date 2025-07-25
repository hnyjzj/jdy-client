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
const limits = ref(12)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const tableLoading = ref(false)
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })
// 获取列表
const getList = async (where = {} as Partial<DepositOrderInfo>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<DepositOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getDepositList(params)
  tableLoading.value = false
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

const cols = [
  {
    title: '所属门店',
    key: 'store.name',
  },
  {
    title: '会员',
    key: 'member.nickname',
    render: (rowData: DepositOrderInfo) => {
      return rowData.member?.nickname || '--'
    },
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
    render: (rowData: DepositOrderInfo) => {
      return [h(
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
      ), h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/sale/deposit/order?id=${rowData.id}`)
          },
        },
        { default: () => '查看详情' },
      )]
    },
  },
]
</script>

<template>
  <div>
    <product-filter
      v-model:showtype="showtype"
      :product-list-total="total" placeholder="搜索订单号" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>

    <template v-if="showtype === 'list'">
      <common-layout-center>
        <div class="p-[16px]">
          <template v-if="OrdersList.length">
            <sale-deposit-list :info="OrdersList" :where="filterList" :is-store-staff="isStaff" @user-click="handleClick" />
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
