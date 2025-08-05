<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getAllocateList, getAllocateWhere } = useAllocate()
const { allocateList, allocateFilterListToArray, allocateFilterList, allocateTotal } = storeToRefs(useAllocate())
const { myStoreList, myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()

const filterData = ref({} as Partial<ExpandPage<Allocate>>)
const limits = ref(10)
const tableLoading = ref(false)
const storeCol = ref()

const filterRef = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/allocate', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取列表 */
const getList = async (where = {} as Partial<Allocate>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Allocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  const res = await getAllocateList(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<Allocate>>(route.fullPath, allocateFilterList.value)
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
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getMyStore({ page: 1, limit: 20 })
await changeStore()
await getAllocateWhere()
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
  pageSize: 50,
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
    title: '调入门店',
    key: 'to_store.name',
    render(row: Allocate) {
      return row.to_store?.name ?? '-'
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
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype" :product-list-total="allocateTotal" placeholder="搜索调拨单号" @change-card="changeCard" @filter="openFilter" @search="search" @clear-search="clearSearch">
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
              <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
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
                    调入门店
                  </div>
                  <div class="val">
                    {{ info?.to_store?.name }}
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

    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="allocateFilterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #from_store_id>
        <n-select
          v-model:value="filterData.from_store_id"
          menu-size="large"
          filterable
          placeholder="选择调出门店"
          :options="storeCol"
          @focus="focus"
        />
      </template>
      <template #to_store_id>
        <n-select
          v-model:value="filterData.to_store_id"
          menu-size="large"
          filterable
          placeholder="选择调入门店"
          :options="storeCol"
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
</style>
