<script setup lang="ts">
// 销售单列表页
import { NButton } from 'naive-ui'

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
const { getSaleWhere, getOrderList, revokedOrder, payOrder } = useOrder()
const filterData = ref({} as Partial<OrderWhere>)
const filterShow = ref(false)
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { id: myStore.value.id, phone: val } })
const limit = ref(50)
// 获取列表
const getList = async (where = {} as Partial<OrderInfo>) => {
  OrdersList.value = []
  const params = { page: searchPage.value, limit: limit.value, where: { store_id: myStore.value.id } } as ReqList<OrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getOrderList(params)
}

// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}

const submitWhere = async (f: OrderWhere) => {
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
const searchProduct = async (e: string) => {
  if (e.length > 0) {
    await getFinishedList({ page: 1, limit: 5, where: { name: e } })
  }
}

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
  await getList()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/sales/add')
}

const getSaleman = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res?.data.value?.code === HttpCode.ERROR) {
    $toast.error(res?.data.value?.message || '请求失败')
  }
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limit.value = pageSize
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
    render: (rowData: OrderInfo) => {
      return rowData.member.nickname || '--'
    },
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
    key: 'products[0].finished.product.name',
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
    render: (rowData: OrderInfo) => {
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
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn" />
        </div>
        <common-tool-list v-model="showtype" :total="total" @height="openFilter" />
      </div>
    </div>
    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="OrdersList.length">
              <sale-sales-list :info="OrdersList" :where="filterList" @cancle="cancelOrder" @pay="payOrderConfirm" />
              <common-page
                v-model:page="searchPage" :total="total" :limit="limit" @update:page="updatePage" />
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
          size="large"
          remote
          @search="getMember"
          @focus="focus"
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
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
