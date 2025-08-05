<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getFinishedList, getFinishedWhere, getFinishedListAll } = useFinished()
const { finishedList, finishedFilterList, finishedFilterListToArray, finishedListTotal, finisheStatistics, finishedListAll } = storeToRefs(useFinished())
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()

const isFilter = ref(false)
const isModel = ref(false)
const isLoading = ref(false)
const isBatchImportModel = ref(false)
const type = ref(1 as ProductFinisheds['type'])
const filterData = ref({} as Partial<ExpandPage<ProductFinisheds>>)
const limits = ref(50)
const tableLoading = ref(false)
useSeoMeta({
  title: '成品列表',
})
const filterRef = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/list/finished', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取成品列表 */
const getList = async (where = {} as Partial<ProductFinisheds>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<ProductFinisheds>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getFinishedList(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<ProductFinisheds>>(route.fullPath, finishedFilterList.value)
  filterData.value = f
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
const submitWhere = async (f: Partial<ExpandPage<ProductFinisheds>>) => {
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

/** 改变每页数量 */
const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: finishedListTotal,
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

/** 高级筛选显示 */
const openFilter = () => {
  isFilter.value = true
}

/** 搜索条码 */
const search = async (e: string) => {
  filterData.value.code = e
  filterData.value.searchPage = 1
  listJump()
}

/** 清空搜索 */
const clearSearch = async () => {
  delete filterData.value.code
  filterData.value.searchPage = 1
  listJump()
}

/** 编辑 */
const edit = (code: string) => {
  jump('/product/manage/edit', { code })
}

/** 添加新成品 */
const goAdd = () => {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
}

/** 查看详情 */
const goInfo = (info: ProductFinisheds) => {
  jump('/product/manage/finished/info', { code: info.code })
}

/** 门店切换刷新 */
const changeStore = async () => {
  filterData.value.searchPage = 1
  listJump()
}

// 页面初始化逻辑
try {
  if (myStore.value.id || myStore.value.id === '') {
    await getFinishedWhere()
    await handleQueryParams()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

/** 表格列定义 */
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
        {
          style: {
            display: 'flex',
            gap: '8px',
            backgroundColor: '#fff',
          },
        },
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
      @change-card="changeCard"
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
            v-model:page="searchPage" :total="finishedListTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <div class="max-[100px]">
            <common-datatable :columns="cols" :list="finishedList" :page-option="pageOption" :loading="tableLoading" />
          </div>
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
    <div class="z-9">
      <product-manage-bottom :statistics="finisheStatistics" />
    </div>
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="finishedFilterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>
