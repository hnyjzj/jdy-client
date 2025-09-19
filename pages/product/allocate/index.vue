<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getAllocateList, getAllocateWhere, getAllocateDetails } = useAllocate()
const { allocateList, allocateFilterListToArray, allocateFilterList, allocateTotal } = storeToRefs(useAllocate())
const { myStoreList, myStore, StoreStaffList } = storeToRefs(useStores())
const { getMyStore, getStoreStaffList } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())
const { oldFilterListToArray } = storeToRefs(useOld())
const { finishedFilterListToArray } = storeToRefs(useFinished())
const { getFinishedWhere } = useFinished()
const { getOldWhere } = useOld()

const searchKey = ref('')
const route = useRoute()

const filterData = ref({} as Partial<ExpandPage<Allocate>>)
const limits = ref(50)
const tableLoading = ref(false)
const storeCol = ref()
const staffCol = ref()

const isExportModel = ref(false)
const filterRef = ref()
const isLoading = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/allocate', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取列表 */
const getList = async (where = {} as Partial<Allocate>) => {
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Allocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  const res = await getAllocateList(params)
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<Allocate>>(route.fullPath, allocateFilterList.value)
  filterData.value = f
  if (filterData.value?.id) {
    searchKey.value = filterData.value.id
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
const submitWhere = async (f: Partial<ExpandPage<Allocate>>) => {
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

function changeStore() {
  storeCol.value = []
  myStoreList.value.forEach((item: Stores) => {
    storeCol.value.push({
      label: `${item.name}${item.alias ? `（${item.alias}）` : ''}`,
      value: item.id,
    })
  })
}

function initStaffCol() {
  staffCol.value = []
  StoreStaffList.value.forEach((item: StoresStaff) => {
    staffCol.value.push({ label: item.nickname, value: item.id })
  })
}
await getMyStore()
await getStoreStaffList({ id: myStore.value.id })
await changeStore()
await initStaffCol()
await getAllocateWhere()
await getOldWhere()
await getFinishedWhere()
// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '货品调拨',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}

/** 搜索 */
async function search(e: string) {
  filterData.value.id = e
  searchPage.value = 1
  listJump()
}

/** 关闭搜索 */
async function clearSearch() {
  delete filterData.value.id
  searchPage.value = 1
  listJump()
}

async function changeMyStore() {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: allocateTotal,
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

// 页面初始化逻辑
try {
  if (myStore.value.id || myStore.value.id === '') {
    await getAllocateWhere()
    await handleQueryParams()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const cols = [
  {
    title: '调拨状态',
    key: 'status',
    render(row: Allocate) {
      return allocateFilterList.value.status?.preset?.[row.status] ?? '-'
    },
  },
  {
    title: '调拨方式',
    key: 'method',
    render(row: Allocate) {
      return allocateFilterList.value.method?.preset?.[row.method] ?? '-'
    },
  },
  {
    title: '仓库类型',
    key: 'type',
    render(row: Allocate) {
      return allocateFilterList.value.type?.preset?.[row.type] ?? '-'
    },
  },
  {
    title: '调拨原因',
    key: 'reason',
    render(row: Allocate) {
      return allocateFilterList.value.reason?.preset?.[row.reason] ?? '-'
    },
  },
  {
    title: '调拨数量',
    key: 'product_count',
  },
  {
    title: '调拨金重',
    key: 'product_total_weight_metal',
  },
  {
    title: '调拨标签价',
    key: 'product_total_label_price',
  },
  {
    title: '调出门店',
    key: 'from_store.name',
    render(row: Allocate) {
      return row.from_store?.name ?? '-'
    },
  },
  {
    title: '调入门店',
    key: 'to_store.name',
    render(row: Allocate) {
      return row.to_store?.name ?? '-'
    },
  },
  {
    title: '发起人',
    key: 'rinitiator_id.name',
    render(row: Allocate) {
      return row.initiator?.nickname ?? '-'
    },
  },
  {
    title: '接收人',
    key: 'receiver_id',
    render(row: Allocate) {
      return row.receiver?.nickname ?? '-'
    },
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '开始时间',
    key: 'created_at',
    render(row: Allocate) {
      return formatTimestampToDateTime(row.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: Allocate) {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        [
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => jump('/product/allocate/info', { id: row.id, type: row.type }),
            },
            { default: () => '详情' },
          ),
        ],
      )
    },
  },
]

async function downloadLocalFile() {
  isLoading.value = true
  try {
    exportProductListToXlsx(allocateList.value, allocateFilterListToArray.value, '调拨单据', [], 1, checkHeaderMap)
  }
  finally {
    isLoading.value = false
  }
}

async function downloadDetails() {
  const params = { page: 1, limit: 20, where: { ...filterData.value } } as ReqList<Allocate>

  // 必须先选择时间范围
  if (!filterData.value?.start_time || !filterData.value?.end_time) {
    return $toast.error('请先在高级筛选内选择时间范围')
  }

  const res = await getAllocateDetails(params)
  if (res?.code !== 200) {
    return $toast.error(res?.message || '获取调拨明细失败')
  }
  if (!res?.data?.length) {
    return $toast.error('暂无调拨明细')
  }

  isLoading.value = true
  try {
    // 处理 product 数据，成品 class → finished_class，非成品 class → old_class
    const product = res.data.map((item) => {
      const prod: Record<string, any> = item.product ?? {}
      if (item.type === GoodsType.ProductFinish) {
        if ('class' in prod) {
          const { class: finished_class, ...rest } = prod
          return { ...rest, finished_class }
        }
        return prod
      }
      else {
        if ('class' in prod) {
          const { class: old_class, ...rest } = prod
          return { ...rest, old_class }
        }
        return prod
      }
    })

    // 删除 status 字段，并重命名 id/remark，避免和调拨字段冲突
    const newProduct = product.map((item) => {
      const obj: Record<string, any> = { ...item }
      delete obj.status
      if ('id' in item) {
        obj.product_id = item.id
        delete obj.id
      }
      if ('remark' in item) {
        obj.product_remark = item.remark
        delete obj.remark
      }
      if ('created_at' in item) {
        obj.product_created_at = item.created_at
        delete obj.created_at
      }
      if ('updated_at' in item) {
        obj.product_updated_at = item.updated_at
        delete obj.updated_at
      }
      return obj
    })

    // oldFilterList 配置里 class → old_class，同时处理 id/remark → product_id/product_remark
    const oldList = oldFilterListToArray.value.map((item) => {
      if (item.name === 'class')
        return { ...item, name: 'old_class' }
      if (item.name === 'id')
        return { ...item, name: 'product_id' }
      if (item.name === 'remark')
        return { ...item, name: 'product_remark' }
      if (item.name === 'created_at')
        return { ...item, name: 'product_created_at' }
      if (item.name === 'updated_at')
        return { ...item, name: 'product_updated_at' }
      return item
    })

    // finishedFilterList 配置里 class → finished_class，同时处理 id/remark → product_id/product_remark
    const finishedList = finishedFilterListToArray.value.map((item) => {
      if (item.name === 'class')
        return { ...item, name: 'finished_class' }
      if (item.name === 'id')
        return { ...item, name: 'product_id' }
      if (item.name === 'remark')
        return { ...item, name: 'product_remark' }
      if (item.name === 'created_at')
        return { ...item, name: 'product_created_at' }
      if (item.name === 'updated_at')
        return { ...item, name: 'product_updated_at' }
      return item
    })

    // 合并配置并去掉 status
    const productToArray = [...finishedList, ...oldList]
    const newProductToArray = productToArray.filter(item => item.name !== 'status' && item.name !== 'store')

    // 导出 Excel
    exportToXlsxMultiple(
      [res.data, newProduct],
      [...allocateFilterListToArray.value, ...newProductToArray],
      { ...checkHeaderMapA, ...oldUnclassHeaderMap },
      '调拨明细',
    )
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
      v-model:search-key="searchKey"
      v-model:showtype="showtype"
      :product-list-total="allocateTotal"
      placeholder="搜索调拨单号"
      :is-export="true"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
      @export="isExportModel = true"
    >
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="pb-20">
      <template v-if="allocateList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="allocateList">
            <template #top="{ info }">
              <div class="status-title" :style="getStatusStyle(info.status, AllocateStatusColorMap)">
                {{ allocateFilterList.status?.preset[info.status] }}
              </div>
            </template>
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨方式
                  </div>
                  <div class="val">
                    {{ allocateFilterList.method?.preset[info.method] }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    仓库类型
                  </div>
                  <div class="val">
                    {{ allocateFilterList.type?.preset[info.type] }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨原因
                  </div>
                  <div class="val">
                    {{ allocateFilterList.reason?.preset[info.reason] }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨状态
                  </div>
                  <div class="val">
                    {{ allocateFilterList.status?.preset[info.status] }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨数量
                  </div>
                  <div class="val">
                    {{ info.product_count }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨金重
                  </div>
                  <div class="val">
                    {{ info.product_total_weight_metal }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调拨标签价
                  </div>
                  <div class="val">
                    {{ info.product_total_label_price }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调出门店
                  </div>
                  <div class="val">
                    {{ info?.from_store?.name }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    调入门店
                  </div>
                  <div class="val">
                    {{ info?.to_store?.name }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    发起人
                  </div>
                  <div class="val">
                    {{ info?.initiator?.nickname || '' }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    接收人
                  </div>
                  <div class="val">
                    {{ info?.receiver?.nickname || '' }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    备注
                  </div>
                  <div class="val">
                    {{ info.remark }}
                  </div>
                </div>
                <div class="flex py-[4px] justify-between">
                  <div>
                    开始时间
                  </div>
                  <div class="val">
                    {{ formatTimestampToDateTime(info.created_at) }}
                  </div>
                </div>
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump('/product/allocate/info', { id: info.id, type: info.type })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="allocateTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="allocateList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-create @click="jump('/product/allocate/add')" />
    <product-upload-choose v-model:is-model="isExportModel" title="导出" first-text="导出单据" second-text="导出明细" @go-add="downloadDetails" @batch="downloadLocalFile" />
    <common-loading v-model="isLoading" />

    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="allocateFilterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #from_store_id>
        <n-select
          v-model:value="filterData.from_store_id"
          menu-size="large"
          placeholder="选择调出门店"
          :options="storeCol"
          clearable
          @focus="focus"
        />
      </template>
      <template #to_store_id>
        <n-select
          v-model:value="filterData.to_store_id"
          menu-size="large"
          placeholder="选择调入门店"
          :options="storeCol"
          clearable
          @focus="focus"
        />
      </template>
      <template #initiator_id>
        <n-select
          v-model:value="filterData.initiator_id"
          menu-size="large"
          placeholder="选择发起人"
          :options="staffCol"
          clearable
          @focus="focus"
        />
      </template>
      <template #receiver_id>
        <n-select
          v-model:value="filterData.receiver_id"
          menu-size="large"
          placeholder="选择接收人"
          :options="staffCol"
          clearable
          @focus="focus"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>
.uploadInp {
  --uno: 'text-14px px-[12px] py-[4px] rounded-[36px] flex-between text-color-light bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
  &-right {
    --uno: 'flex items-center py-[6px] px-4 rounded-[36px] text-#FFF';
    background: linear-gradient(to bottom, #1b6ceb, #6da6ff);
    box-shadow: #1111113d 0px 2px 2px 1px;
  }
}
.val {
  --uno: 'text-right w-200px';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-title {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.orange {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.bule {
  --uno: 'bg-#1b6ceb';
}
.grey {
  --uno: 'bg-[#999]';
}
.purple {
  --uno: 'bg-[#C7DAFF]';
}
</style>
