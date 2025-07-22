<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '订金单列表',
})
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()

const { filterListToArray, OrdersList, total, filterList, searchPage } = storeToRefs(useDepositOrder())
const { getSaleWhere, getDepositList, isStoreStaff } = useDepositOrder()
const filterData = ref({} as Partial<DepositOrderWhere>)
const filterShow = ref(false)
const limits = ref(12)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })

// 获取列表
const getList = async (where = {} as Partial<DepositOrderInfo>) => {
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<DepositOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getDepositList(params)
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
  OrdersList.value = []
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
  OrdersList.value = []
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

const showtype = ref<'list' | 'table'>('list')
const nowPage = computed(() => searchPage.value)
const pageOption = ref({
  page: nowPage,
  pageSize: 50,
  itemCount: total.value,
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
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="changeStores" />
          <product-filter-search
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <div class="flex-center-between gap-2 py-[16px]">
          <div class="flex items-center gap-[12px]">
            <div class="text-size-[14px] color-[#fff]">
              共{{ total }}条数据
            </div>
            <div
              class="px-[8px] py-[4px] bg-[#fff] color-[#2775EE] text-center rounded-[20px] cursor-pointer"
              @click="showtype = showtype === 'list' ? 'table' : 'list'">
              {{ showtype === 'list' ? '切换表格' : '切换列表' }}
            </div>
          </div>
          <div @click="openFilter()">
            <product-filter-senior class="color-[#fff]" />
          </div>
        </div>
      </div>
    </div>
    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="OrdersList.length">
              <sale-deposit-list :info="OrdersList" :where="filterList" :is-store-staff="isStaff" @user-click="handleClick" />
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
      <common-datatable :columns="cols" :list="OrdersList" :page-option="pageOption" />
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
