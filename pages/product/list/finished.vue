<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getFinishedList, getFinishedWhere, getFinishedListAll, updateFinishedCode, updateFinishedUpdata, findFinishedCode, getFinishedEmptyImage } = useFinished()
const { finishedList, finishedFilterList, finishedFilterListToArray, finishedListTotal, finisheStatistics, finishedListAll } = storeToRefs(useFinished())
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()
const searchKey = ref('')

const isFilter = ref(false)
const isModel = ref(false)
const isExportModel = ref(false)
const isBatchCodeModel = ref(false)
const isLoading = ref(false)
const filterData = ref({} as Partial<ExpandPage<ProductFinisheds>>)
const limits = ref(50)
const tableLoading = ref(false)
const isUploadModel = ref(false)
const isCodeModel = ref(false)
const uploadRef = ref()
const uploadCodeRef = ref()
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
  if (filterData.value.code) {
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
  pageSlot: 6,
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
  { title: '状态', render: (row: ProductFinisheds) => {
    return finishedFilterList.value.status?.preset[row.status]
  } },
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
            gap: '10px',
            fontWeight: 'bold',
          },
        },
        [
          h(
            'span',
            {
              style: {
                color: '#0D6CE4',
                cursor: 'pointer',
                fontWeight: 'bold',
              },
              onClick: () => {
                edit(rowData.code)
              },
            },
            '编辑',
          ),
          h(
            'span',
            {
              style: {
                color: '#41CF84',
                cursor: 'pointer',
                fontWeight: 'bold',
              },
              onClick: () => {
                goInfo(rowData)
              },
            },
            '详情',
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
  catch (err) {
    $toast.error('导出失败')
    throw new Error(`${err}`)
  }
  finally {
    isLoading.value = false
  }
}
/**
 * 货品更新
 */
async function submitGoods(req: ProductFinisheds[]) {
  if (!req?.length) {
    return
  }
  isLoading.value = true
  try {
    const res = await updateFinishedUpdata(req)
    if (res?.code === HttpCode.SUCCESS) {
      $toast.success('货品更新成功')
      listJump()
    }
    else {
      $toast.error(res?.message ?? '更新货品失败')
    }
  }
  finally {
    isUploadModel.value = false
    isLoading.value = false
    uploadRef.value.clearData()
  }
}

/** 条码更新 */
async function submitCode(code: BatchCode[]) {
  if (!code?.length) {
    return
  }
  isLoading.value = true
  try {
    const res = await updateFinishedCode(code)
    if (res?.code === HttpCode.SUCCESS) {
      $toast.success('条码更新成功')
      listJump()
    }
    else {
      $toast.error(res?.message ?? '更新条码失败')
    }
  }
  catch (error) {
    throw new Error(`${error ?? '更新条码失败'}`)
  }
  finally {
    isCodeModel.value = false
    isLoading.value = false
    uploadCodeRef.value.clearData()
  }
}

async function batchFindCode(e: string[]) {
  isLoading.value = true
  try {
    const res = await findFinishedCode(e)
    if (res?.code === HttpCode.SUCCESS) {
      if (!res?.data?.length) {
        $toast.error('没有找到条码')
      }
      else {
        await exportProductListToXlsx(res.data, finishedFilterListToArray.value, '货品列表')
        isBatchCodeModel.value = false
        $toast.success('批量查找条码导出成功')
      }
    }
    else {
      $toast.error(res?.message ?? '批量查找条码失败')
    }
  }
  finally {
    isLoading.value = false
  }
}

async function downloadEmptyImage() {
  isLoading.value = true
  try {
    const res = await getFinishedEmptyImage(myStore.value.id)
    if (res?.code === HttpCode.SUCCESS) {
      if (!res?.data?.length) {
        $toast.error('没有无图货品')
      }
      else {
        await exportProductListToXlsx(res.data, finishedFilterListToArray.value, '无图货品列表')
        isExportModel.value = false
        $toast.success('导出成功')
      }
    }
    else {
      $toast.error(res?.message ?? '查找无图货品失败')
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
      v-model:search-key="searchKey"
      :product-list-total="finishedListTotal"
      placeholder="搜索条码"
      :is-export="true"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
      @export="isExportModel = true"
    >
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="pb-20 px-4">
      <common-layout-center>
        <template v-if="finishedList?.length">
          <template v-if="showtype === 'list'">
            <product-list-main :is-finished="true" :product-list="finishedList" :filter-list="finishedFilterList" @edit="(code: any) => edit(code)" @go-info="(info: any) => goInfo(info)" />
            <common-page
              v-model:page="searchPage" :total="finishedListTotal" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-datatable :columns="cols" :list="finishedList" :page-option="pageOption" :loading="tableLoading" />
          </template>
        </template>
        <template v-else>
          <common-empty width="100px" />
        </template>
      </common-layout-center>
    </div>
    <common-loading v-model="isLoading" />
    <div class="z-9">
      <product-manage-bottom :statistics="finisheStatistics" />
    </div>
    <product-upload-find-code v-model:is-model="isBatchCodeModel" @upload="batchFindCode" />
    <product-upload-choose v-model:is-model="isModel" title="更新" first-text="数据更新" second-text="条码更新" @go-add="isCodeModel = true" @batch="isUploadModel = true" />
    <product-upload-choose v-model:is-model="isExportModel" title="导出" first-text="直接导出" second-text="批量查条码" @go-add="isBatchCodeModel = true" @batch="downloadLocalFile">
      <template #other>
        <div class="box ml-2" @click="downloadEmptyImage">
          <div class="batch red">
            <img class="block" src="/images/icon/export.png" width="24" height="24">
          </div>
          <div class="export-text">
            无图货品
          </div>
        </div>
      </template>
    </product-upload-choose>
    <product-upload-code ref="uploadCodeRef" v-model="isCodeModel" @upload="submitCode" />
    <product-upload-warehouse ref="uploadRef" v-model="isUploadModel" title="数据更新" :filter-list="finishedFilterList" :type="1" @upload="submitGoods">
      <template #content>
        <div>
          <div class="pb-2">
            1. 成品列表、入库记录里面导出需要更新的货品；
          </div>
          <div class="pb-2">
            2. 修改需要更新的地方；
          </div>
          <div class="pb-2">
            3. 删除不在入库模板中的数据；
          </div>
          <div class="pb-2">
            4. 上传更新后的货品，不要修改表格式。
          </div>
        </div>
      </template>
    </product-upload-warehouse>
    <common-create @create="isModel = true">
      <template #content>
        <icon name="i-icon:setup" :size="24" color="#FFF" />
      </template>
    </common-create>
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="finishedFilterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col items-center w-[104px] h-[82px] rounded-[18px] bg-[rgba(255,255,255,1)] dark:bg-[rgba(0,0,0,0.3)]';
}
.batch {
  --uno: 'flex justify-center items-center w-36px h-36px rounded-full mt-3';
  background: linear-gradient(90deg, rgb(197, 68, 46), rgb(189, 61, 52));
}
.export-text {
  --uno: 'text-color text-14px pb-2 pt-2.5';
}
</style>
