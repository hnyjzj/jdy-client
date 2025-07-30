<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getFinishedList, getFinishedWhere, getFinishedListAll } = useFinished()
const { finishedList, finishedFilterList, finishedFilterListToArray, finishedListTotal, finisheStatistics, finishedListAll } = storeToRefs(useFinished())
const { searchPage, showtype } = storeToRefs(usePages())
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isLoading = ref(false)
const isBatchImportModel = ref(false)
const type = ref(1 as ProductFinisheds['type'])
const filterData = ref({} as Partial<ProductFinisheds>)
const limits = ref(50)
const tableLoading = ref(false)
useSeoMeta({
  title: '成品列表',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  searchPage.value = 1
  await submitWhere({ code: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取成品列表
async function getList(where = {} as Partial<ProductFinisheds>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<ProductFinisheds>
  params.where = where
  const res = await getFinishedList(params)
  tableLoading.value = false
  return res as any
}

try {
  if (myStore.value.id || myStore.value.id === '') {
    await getList()
    await getFinishedWhere()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductFinisheds>, isSearch: boolean = false) {
  filterData.value = { ...f }
  searchPage.value = 1
  finishedList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res?.message ?? '失败')
}

/** 编辑 */
function edit(code: string) {
  jump('/product/manage/edit', { code })
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
}

function goInfo(info: ProductFinisheds) {
  jump('/product/manage/finished/info', { code: info.code })
}

const filterRef = ref()
async function changeStore() {
  searchPage.value = 1
  filterRef.value.reset()
  await getList()
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: finishedListTotal,
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
  { title: '条码', key: 'code' },
  { title: '所属大类', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.class?.preset[row.class]
  } },
  { title: '货品名称', key: 'name' },
  { title: '货品品牌', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.brand?.preset[row.brand]
  } },
  { title: '供应商', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.supplier?.preset[row.supplier]
  } },
  { title: '材质', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.material?.preset[row.material]
  } },
  { title: '成色', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.quality?.preset[row.quality]
  } },
  { title: '宝石', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.gem?.preset[row.gem]
  } },
  { title: '品类', key: '', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.category?.preset[row.category]
  } },
  { title: '工艺', key: 'craft' },
  { title: '库龄', key: '', render: (row: ProductFinisheds) => {
    return getDaysFromToday(row.enter_time || '')
  } },
  {
    title: '操作',
    key: 'action',
    fixed: 'right', // 固定到右侧
    render: (rowData: ProductFinisheds) => {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        [
          h(
            NButton,
            {
              type: 'primary',
              size: 'small',
              onClick: () => {
                edit(rowData.code)
              },
            },
            { default: () => '编辑' },
          ),
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => {
                goInfo(rowData)
              },
            },
            { default: () => '详情' },
          ),
        ],
      )
    },
  },
]

/**
 * 货品列表导出excel表格
 */
async function downloadLocalFile() {
  isLoading.value = true
  try {
    const res = await getFinishedListAll({ all: true, where: filterData.value })
    if (res?.code === HttpCode.SUCCESS) {
      if (!res?.data.list || !res?.data?.list.length) {
        return $toast.error('列表是空的')
      }
      else {
        await exportProductListToXlsx(finishedListAll.value, finishedFilterListToArray.value, '货品列表')
      }
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype"
      :product-list-total="finishedListTotal"
      placeholder="搜索条码"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>

    <!-- 列表 -->
    <div class="pb-20">
      <template v-if="finishedList?.length">
        <template v-if="showtype === 'list'">
          <product-list-main :is-finished="true" :product-list="finishedList" :filter-list="finishedFilterList" @edit="edit" @go-info="goInfo" />
          <common-page
            v-model:page="searchPage" :total="finishedListTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="finishedList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-create @click="downloadLocalFile">
      <template #content>
        <icon name="i-icon:download" :size="24" color="#FFF" />
      </template>
    </common-create>
    <common-loading v-model="isLoading" />
    <product-manage-bottom :statistics="finisheStatistics" />
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="finishedFilterListToArray" @submit="submitWhere" />
  </div>
</template>
