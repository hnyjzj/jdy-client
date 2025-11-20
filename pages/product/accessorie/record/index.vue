<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getProductHistory, getHistoryWhere } = useAcessorieRecord()
const { historyFilterList, historyListTotal, productRocordList, HistoryFilterListToArray } = storeToRefs(useAcessorieRecord())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()
const { accessorieFilterListToArray } = storeToRefs(useAccessorie())
const { getAccessorieWhere } = useAccessorie()
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()

const filterData = ref({} as Partial<ExpandPage<AccessorieRecord>>)
const searchKey = ref('')
const limits = ref(50)
const tableLoading = ref(false)
// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '配件记录',
})

const openFilter = async () => {
  isFilter.value = true
}

/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/accessorie/record', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取列表 */
const getList = async (where = {} as Partial<AccessorieRecord>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<AccessorieRecord>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getProductHistory(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<AccessorieRecord>>(route.fullPath, historyFilterList.value)
  filterData.value = f
  if (filterData.value.name) {
    searchKey.value = filterData.value.name
  }
  if (f.searchPage)
    searchPage.value = Number(f.searchPage)
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.limits)
    limits.value = Number(f.limits)
  await getList(filterData.value)
}

/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<AccessorieRecord>>) => {
  filterData.value = {
    ...f,
    searchPage: 1,
    limits: limits.value,
  }
  listJump()
}

/** 修改页码 */
const updatePage = (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

await getMyStore()
// 页面初始化逻辑
try {
  if (myStore.value.id || myStore.value.id === '') {
    await getAccessorieWhere()
    await getHistoryWhere()
    await handleQueryParams()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterRef = ref()
/** 门店切换刷新 */
const changeMyStore = async () => {
  filterData.value.searchPage = 1
  listJump()
}
/** 切换显示 */
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}

// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}

/** 搜索条码 */
const search = async (e: string) => {
  filterData.value.name = e
  filterData.value.searchPage = 1
  listJump()
}

/** 清空搜索 */
const clearSearch = async () => {
  delete filterData.value.name
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: historyListTotal,
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
    title: '操作类型',
    key: 'action',
    render(row: AccessorieRecord) {
      return historyFilterList.value?.action?.preset?.[row.action] ?? '-'
    },
  },
  {
    title: '原因',
    key: 'reason',
    render(row: AccessorieRecord) {
      return row?.reason ?? '-'
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
    title: '所属门店',
    key: 'store.name',
    render(row: AccessorieRecord) {
      const acc = row.new_value?.product || row.new_value
      return acc?.store?.name ?? '-'
    },
  },
  // 动态字段
  ...accessorieFilterListToArray.value
    .filter(item => item.create)
    .map(item => ({
      title: item.label,
      key: item.name,
      render(row: AccessorieRecord) {
        const acc = row.new_value?.product || row.new_value
        const value = acc[item.name]

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
      v-model:showtype="showtype"
      v-model:search="searchKey"
      :product-list-total="historyListTotal"
      placeholder="搜素关联配件名称"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
    >
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-10">
      <template v-if="productRocordList?.length">
        <template v-if="showtype === 'list'">
          <template v-for="(info, index) in productRocordList" :key="index">
            <common-card-list>
              <template #top>
                <div>{{ historyFilterList.action?.preset[info.action] }}</div>
              </template>
              <template #info>
                <div class="py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                      原因
                    </div>
                    <div class="text-align-end">
                      {{ info?.reason }}
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

                  <accessorie-record-card :filter-list="accessorieFilterListToArray" :accessories="info.new_value?.product ? info.new_value?.product : info.new_value" />
                </div>
              </template>
              <template #footer>
                <div class="flex-end text-size-[14px]">
                  <div>
                    <common-button-rounded
                      padding="4px 36px"
                      content="详情" @click="jump('/product/accessorie/record/info', { id: info?.id })"
                    />
                  </div>
                </div>
              </template>
            </common-card-list>
          </template>
          <common-page
            v-model:page="searchPage" :total="historyListTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="productRocordList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
      <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="HistoryFilterListToArray" @submit="submitWhere" @reset="resetWhere" />
    </div>
  </div>
</template>
