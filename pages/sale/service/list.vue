<script setup lang="ts">
import { useCascaderAreaData } from '@vant/area-data'
// 维修单列表
useSeoMeta({
  title: '维修单列表',
})
const areaoptions = useCascaderAreaData()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getRepairOrderWhere, getRepairOrderList, cancelRepairOrder, payRepairOrder } = useRepair()
const { repairOrderList, total, repairFilterList, repairFilterListToArray, showtype } = storeToRefs(useRepair())
const { searchPage } = storeToRefs(usePages())
const filterData = ref({} as Partial<service>)
const filterShow = ref(false)
const tableLoading = ref(false)
const limits = ref(50)

const getSaleman = async () => {
  await getStoreStaffList({ id: myStore.value.id })
}
const cancelOrder = async (id: string) => {
  return await cancelRepairOrder({ id })
}
const payOrder = async (id: string) => {
  return await payRepairOrder({ id })
}

// 获取列表
const getList = async (where = {} as Partial<service>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<ServiceOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getRepairOrderList(params)
  tableLoading.value = false
}

// 打开高级筛选
const openFilter = () => {
  getSaleman()
  // 打开筛选
  filterShow.value = true
}
const route = useRoute()
// 获取where 条件

await getRepairOrderWhere()
const searchKey = ref('')
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<service>(route.fullPath, repairFilterList.value)
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
  await getList(filterData.value as Partial<service>)
}
// 默认请求列表
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/sale/service/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
const submitWhere = async (f: service) => {
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
// 顶部搜索订单
const searchOrder = async (id: string) => {
  filterData.value.id = id
  filterData.value.searchPage = 1
  listJump()
}
// 清空顶部搜索
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
  filterData.value.searchPage = 1
  await getList(filterData.value)
}
const Key = ref()
const cityOptions = ref<any>([])
const areaOptions = ref<any>([])
const setNowProvince = () => {
  filterData.value.city = undefined
  filterData.value.area = undefined
  cityOptions.value = [...areaoptions.filter(item => item.value === filterData.value.province)]
  cityOptions.value = cityOptions.value[0].children
  Key.value = new Date().getTime().toString()
}

const setNowcity = () => {
  filterData.value.area = undefined
  areaOptions.value = [...cityOptions.value.filter((item: any) => item.value === filterData.value.city)]
  areaOptions.value = areaOptions.value[0].children
  Key.value = new Date().getTime().toString()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/service/add')
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
    key: 'member.nickname',
    render: (rowData: DepositOrderInfo) => {
      return repairFilterList.value.status?.preset[rowData.status] || '--'
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
    title: '维修项目',
    key: 'name',
  },
  {
    title: '货品名称',
    key: '',
    render: (rowData: ServiceOrderInfo) => {
      return rowData?.products?.length ? rowData?.products[0]?.name || '--' : '--'
    },
  },
  {
    title: '维修费',
    key: 'expense',
  },
  {
    title: '取货方式',
    render: (rowData: ServiceOrderInfo) => {
      return rowData?.delivery_method === 1 ? '自提' : '邮寄'
    },
  },

  {
    title: '创建时间',
    key: 'age',
    render: (rowData: ServiceOrderInfo) => {
      return formatISODate(rowData.created_at as string)
    },
  },
  {
    title: '更新时间',
    key: 'age',
    render: (rowData: ServiceOrderInfo) => {
      return formatISODate(rowData.updated_at as string)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render: (rowData: ServiceOrderInfo) => {
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
            navigateTo(`/sale/service/info?id=${rowData.id}`)
          },
        },
        { default: () => '详情' },
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
      placeholder="搜索订单号" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <div class="p-4">
      <common-layout-center>
        <template v-if="showtype === 'list'">
          <template v-if="repairOrderList.length">
            <sale-service-list
              :list="repairOrderList"
              :cancel-order="cancelOrder"
              :pay-order="payOrder"
              :where="repairFilterList"
              :get-list="getList"
            />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-empty text="暂无数据" />
          </template>
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="repairOrderList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </common-layout-center>
    </div>
    <!-- filter -->
    <div>
      <common-filter-where v-model:show="filterShow" :data="filterData" :filter="repairFilterListToArray" @submit="submitWhere" @reset="resetWhere">
        <template #receptionist_id>
          <n-select
            v-model:value="filterData.receptionist_id"
            placeholder="接待员"
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

        <template #province>
          <n-select
            v-model:value="filterData.province"
            filterable
            placeholder="请选择省份"
            :options="areaoptions.map(v => ({
              label: v.text,
              value: v.value,
            }))"
            clearable
            remote
            size="large"
            @update:value="setNowProvince"
            @focus="focus"
          />
        </template>
        <template #city>
          <div :key="Key">
            <n-select
              v-model:value="filterData.city"
              filterable
              placeholder="请选择城市"
              :options="cityOptions.map((v:any) => ({
                label: v.text,
                value: v.value,
              }))"
              clearable
              remote
              size="large"
              @update:value="setNowcity"
              @focus="focus"
            />
          </div>
        </template>
        <template #area>
          <div :key="Key">
            <n-select
              v-model:value="filterData.area"
              filterable
              placeholder="请选择省份"

              :options="areaOptions.map((v:any) => ({
                label: v.text,
                value: v.value,
              }))"
              clearable
              remote
              size="large"
              @focus="focus"
            />
          </div>
        </template>
      </common-filter-where>
    </div>
    <common-create @create="newAdd()" />
  </div>
</template>

<style lang="scss" scoped>

</style>
