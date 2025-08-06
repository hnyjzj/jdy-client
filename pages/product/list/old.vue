<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())

const { getOldList, getOldListAll, getOldWhere } = useOld()
const { oldList, oldFilterList, oldFilterListToArray, oldListTotal } = storeToRefs(useOld())
const { searchPage, showtype } = storeToRefs(usePages())

const searchKey = ref('')
const route = useRoute()

// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const type = ref(2 as ProductOlds['type'])
const filterData = ref({} as Partial<ExpandPage<ProductOlds>>)

const limits = ref(50)
const tableLoading = ref(false)
const loading = ref(false)

useSeoMeta({
  title: '旧料列表',
})
/** 高级筛选显示 */
const openFilter = () => {
  isFilter.value = true
}
const filterRef = ref()

/** 跳转并刷新列表，带参数 */
const listJump = () => {
  const url = UrlAndParams('/product/list/old', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取列表 */
const getList = async (where = {} as Partial<ProductOlds>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<ProductOlds>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getOldList(params)
  tableLoading.value = false
  return res
}

/** 读取 URL 参数并初始化列表 */
const handleQueryParams = async () => {
  // getQueryParams 需要定义或从工具导入，解析URL带的筛选和分页参数
  const f = getQueryParams<Partial<ExpandPage<ProductOlds>>>(route.fullPath, oldFilterList.value)
  filterData.value = f
  if (filterData.value?.code) {
    searchKey.value = filterData.value.code
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

/** 搜索 */
async function search(e: string) {
  filterData.value.code = e
  filterData.value.searchPage = 1
  listJump()
}

/** 关闭搜索 */
async function clearSearch() {
  delete filterData.value.code
  filterData.value.searchPage = 1
  listJump()
}

/** 筛选列表提交 */
async function submitWhere(f: Partial<ProductOlds>) {
  filterData.value = { ...f }
  filterData.value.searchPage = 1
  oldList.value = []
  listJump()
}

/** 分页修改 */
const updatePage = (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

/** 编辑 */
function edit(code: string) {
  jump('/product/manage/edit', { code })
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
}

function goInfo(info: ProductOlds) {
  jump('/product/manage/old/info', { id: info.id })
}

/** 门店切换刷新 */
async function changeStore() {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: oldListTotal,
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

try {
  if (myStore.value.id || myStore.value.id === '') {
    await getOldWhere()
    await handleQueryParams()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
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

const cols = [
  { title: '条码', key: 'code' },
  { title: '所属大类', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.class?.preset[row.class] || ''
  } },
  { title: '货品名称', key: 'name' },
  { title: '货品品牌', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.brand?.preset[row.brand] || ''
  } },
  { title: '供应商', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.supplier?.preset[row.supplier] || ''
  } },
  { title: '材质', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.material?.preset[row.material] || ''
  } },
  { title: '成色', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.quality?.preset[row.quality] || ''
  } },
  { title: '宝石', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.gem?.preset[row.gem] || ''
  } },
  { title: '品类', key: '', render: (row: ProductOlds) => {
    return oldFilterList.value.category?.preset[row.category] || ''
  } },
  { title: '工艺', key: 'craft' },
  {
    title: '操作',
    key: 'action',
    fixed: 'right', // 固定到右侧
    render: (rowData: ProductOlds) => {
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
  loading.value = true
  try {
    const res = await getOldListAll({ all: true, where: filterData.value })
    if (res?.code === HttpCode.SUCCESS) {
      if (!res?.data?.list || !res?.data?.list.length) {
        return $toast.error('列表是空的')
      }
      else {
        await exportProductListToXlsx(res.data.list, oldFilterListToArray.value, '旧料列表', [], 2)
      }
    }
  }
  catch (err) {
    $toast.error('导出失败')
    throw new Error(`${err}`)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="oldListTotal"
      placeholder="搜索条码"
      :is-export="true"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
      @export="downloadLocalFile"
    >
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="pb-20">
      <template v-if="oldList?.length">
        <template v-if="showtype === 'list'">
          <product-list-main :product-list="oldList" :filter-list="oldFilterList" @edit="edit" @go-info="goInfo" />
          <common-page
            v-model:page="searchPage" :total="oldListTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="oldList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-loading v-model="loading" text="正在处理中" />

    <common-create @click="downloadLocalFile">
      <template #content>
        <icon name="i-icon:download" :size="24" color="#FFF" />
      </template>
    </common-create>
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="oldFilterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>
