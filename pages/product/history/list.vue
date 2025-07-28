<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getProductHistory, getHistoryWhere, getProductHistoryAll } = useProductManage()
const { getFinishedWhere } = useFinished()
const { historyFilterList, historyListTotal, productRocordList, HistoryFilterListToArray } = storeToRefs(useProductManage())
const { finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())
const { oldFilterListToArray } = storeToRefs(useOld())

const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList, getMyStore } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)
const isLoading = ref(false)
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
  title: '货品记录',
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
  if (myStore.value.id) {
    where.store_id = myStore.value.id
  }
  const res = await getProductHistory(params)
  tableLoading.value = false
  return res as any
}
try {
  await getList()
  await getHistoryWhere()
  await getFinishedWhere()
  await changeStore()
  await getStoreList({ page: 1, limit: 20 })
  await getMyStore({ page: 1, limit: 20 })
}
catch (error) {
  $toast.error('初始化数据失败')
  console.error('初始化数据失败:', error)
}

const filterData = ref({} as Partial<ProductHistories>)

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
    render(row: ProductHistories) {
      return historyFilterList.value.action?.preset?.[row.action] ?? '-'
    },
  },
  {
    title: '操作时间',
    key: 'updated_at',
    render(row: ProductHistories) {
      return formatTimestampToDateTime(row.updated_at)
    },
  },
  {
    title: '关联单号',
    key: 'source_id',
  },
  {
    title: '所属大类',
    key: 'class',
    render(row: ProductHistories) {
      return finishedFilterList.value?.class?.preset?.[row?.new_value?.class] ?? '-'
    },
  },
  {
    title: '所属门店',
    key: 'store',
    render(row: ProductHistories) {
      return row?.new_value?.store?.name ?? '-'
    },
  },
  {
    title: '条码',
    key: 'code',
    render(row: ProductHistories) {
      return row?.new_value?.code ?? '-'
    },
  },
  {
    title: '货品名称',
    key: 'name',
    render(row: ProductHistories) {
      return row?.new_value?.name ?? '-'
    },
  },
  {
    title: '入网费',
    key: 'access_fee',
    render(row: ProductHistories) {
      return row?.new_value?.access_fee ?? '-'
    },
  },
  {
    title: '零售方式',
    key: 'retail_type',
    render(row: ProductHistories) {
      return finishedFilterList.value.retail_type?.preset?.[row?.new_value?.retail_type] ?? '-'
    },
  },
  {
    title: '标签价',
    key: 'label_price',
    render(row: ProductHistories) {
      return row?.new_value?.label_price ?? '-'
    },
  },
  {
    title: '零售工费',
    key: 'labor_fee',
    render(row: ProductHistories) {
      return row?.new_value?.labor_fee ?? '-'
    },
  },
  {
    title: '供应商',
    key: 'supplier',
    render(row: ProductHistories) {
      return finishedFilterList.value.supplier?.preset?.[row?.new_value?.supplier] ?? '-'
    },
  },
  {
    title: '操作',
    key: 'action-btn',
    fixed: 'right',
    render(row: ProductHistories) {
      return h(
        'div',
        { style: 'display: flex; justify-content: flex-end;' },
        [
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => jump('/product/history/info', { id: row?.id }),
            },
            { default: () => '详情' },
          ),
        ],
      )
    },
  },
]

/**
 * 记录列表导出excel表格
 */
async function downloadLocalFile() {
  isLoading.value = true

  try {
    const res = await getProductHistoryAll({
      all: true,
      where: filterData.value,
    })
    if (res?.code === HttpCode.SUCCESS) {
      if (!res?.data.list || !res?.data?.list.length) {
        return $toast.error('列表是空的')
      }

      // 把 new_value 字段展开到每个数据项的外层，合并成一个新的对象数组 如果冲突，以 外层 为准
      const transformed = res.data.list.map(({ new_value: newObj, ...rest }) => ({
        ...newObj,
        ...rest,
      }))

      // 合并多个筛选字段数组：
      // 1. 原始筛选字段列表（保留原样）
      // 2. 成品筛选字段列表：将 name 为 'class' 的改成 'finish_class'
      // 3. 旧料筛选字段列表：将 name 为 'class' 的改成 'old_class'
      const listToArray = [
        ...HistoryFilterListToArray.value,
        ...finishedFilterListToArray.value.map(item => ({
          ...item,
          name: item.name === 'class' ? 'finish_class' : item.name,
        })),
        ...oldFilterListToArray.value.map(item => ({
          ...item,
          name: item.name === 'class' ? 'old_class' : item.name,
        })),
      ]

      // 调用导出函数，把数据导出为 Excel
      exportHistoryListToXlsx(transformed, listToArray)
    }
  }
  finally {
    // 无论成功或失败，最后关闭加载状态
    isLoading.value = false
  }
}
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
    <div class="pb-10">
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
                <div class="flex-between">
                  <div>
                    所属大类
                  </div>
                  <div class="text-align-end">
                    {{ finishedFilterList.class?.preset[info?.new_value?.class] }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    所属门店
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.store?.name }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    条码
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.code }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    货品名称
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.name }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    入网费
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.access_fee }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    零售方式
                  </div>
                  <div class="text-align-end">
                    {{ finishedFilterList.retail_type?.preset[info?.new_value?.retail_type] }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    标签价
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.label_price }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    零售工费
                  </div>
                  <div class="text-align-end">
                    {{ info?.new_value?.labor_fee }}
                  </div>
                </div>
                <div class="flex-between">
                  <div>
                    供应商
                  </div>
                  <div class="text-align-end">
                    {{ finishedFilterList.supplier?.preset[info?.new_value?.supplier] }}
                  </div>
                </div>
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump('/product/history/info', { id: info?.id })" />
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
    <common-create @click="downloadLocalFile">
      <template #content>
        <icon name="i-icon:download" :size="24" color="#FFF" />
      </template>
    </common-create>
    <common-loading v-model="isLoading" />
  </div>
</template>
