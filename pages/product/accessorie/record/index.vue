<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getProductHistory, getHistoryWhere } = useAcessorieRecord()
const { historyFilterList, historyListTotal, productRocordList, HistoryFilterListToArray } = storeToRefs(useAcessorieRecord())
const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList, getMyStore } = useStores()
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)
const searchKey = ref('')
// 筛选框显示隐藏
const isFilter = ref(false)
const storeCol = ref()
function changeStore() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
useSeoMeta({
  title: '配件记录',
})

const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  await submitWhere({ code: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取货品列表
async function getList(where = {} as Partial<HistoryWhere>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<HistoryWhere>
  params.where = where
  if (myStore.value?.id) {
    params.where.store_id = myStore.value.id
  }
  const res = await getProductHistory(params)
  tableLoading.value = false
  return res as any
}
try {
  await getList()
  await getHistoryWhere()
  await getAccessorieCategoryWhere()
  await changeStore()
  await getStoreList({ page: 1, limit: 20 })
  await getMyStore({ page: 1, limit: 20 })
}
catch (error) {
  $toast.error('初始化数据失败')
  console.error('初始化数据失败:', error)
}

const filterData = ref({} as Partial<AccessorieRecord>)

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<HistoryWhere>, isSearch: boolean = false) {
  filterData.value = { ...f }
  searchPage.value = 1
  productRocordList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res.message ?? '筛选失败')
}

const filterRef = ref()
async function changeMyStore() {
  searchPage.value = 1
  filterRef.value.reset()
  await getList()
}
const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: historyListTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    pull(1)
  },
  onChange: (page: number) => {
    pull(page)
  },
})

const cols = [
  {
    title: '操作类型',
    key: 'action',
    render(row: AccessorieRecord) {
      return historyFilterList.value?.action?.preset?.[row.action] ?? '-'
    },
  },
  {
    title: '操作时间',
    key: 'updated_at',
    render(row: AccessorieRecord) {
      return formatTimestampToDateTime(row.updated_at)
    },
  },
  {
    title: '关联单号',
    key: 'source_id',
    render(row: AccessorieRecord) {
      return row.source_id ?? '-'
    },
  },
  {
    title: '库存',
    key: 'stock',
    render(row: AccessorieRecord) {
      const acc = row.new_value?.product || row.new_value
      return acc?.stock ?? '-'
    },
  },
  {
    title: '所属门店',
    key: 'store.name',
    render(row: AccessorieRecord) {
      const acc = row.new_value?.product || row.new_value
      return acc?.store?.name ?? '-'
    },
  },
  // 动态字段
  ...categoryFilterListToArray.value
    .filter(item => item.create)
    .map(item => ({
      title: item.label,
      key: item.name,
      render(row: AccessorieRecord) {
        const acc = row.new_value?.product || row.new_value
        const category = acc?.category ?? {}
        const value = category?.[item.name]

        if (item.input === 'select') {
          return item.preset?.[value] ?? '-'
        }

        return value ?? '-'
      },
    })),
  {
    title: '操作',
    key: 'action_btn',
    fixed: 'right',
    render(row: AccessorieRecord) {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => jump('/product/accessorie/record/info', { id: row.id }),
        },
        { default: () => '详情' },
      )
    },
  },
]
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype" v-model:search="searchKey" :product-list-total="historyListTotal" placeholder="搜素关联产品编号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-10">
      <template v-if="productRocordList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="productRocordList">
            <template #top="{ info }">
              <div>{{ historyFilterList.action?.preset[info.action] }}</div>
            </template>
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <div class="flex-between">
                  <div>
                    操作时间
                  </div>
                  <div class="text-align-end">
                    {{ formatTimestampToDateTime(info.updated_at) }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    关联单号
                  </div>
                  <div class="text-align-end">
                    {{ info.source_id }}
                  </div>
                </div>

                <accessorie-record-card :filter-list="categoryFilterListToArray" :accessories="info.new_value?.product ? info.new_value?.product : info.new_value" />
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump('/product/accessorie/record/info', { id: info?.id })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="historyListTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="productRocordList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>

      <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="HistoryFilterListToArray" @submit="submitWhere" />
    </div>
  </div>
</template>
