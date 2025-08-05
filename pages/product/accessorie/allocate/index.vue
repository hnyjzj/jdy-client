<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getAccessorieAllocate, getAccessorieAllocateWhere } = useAccessorieAllocate()
const { accessorieAllocateList, accessorieAllocateFilterListToArray, accessorieAllocateFilterList, accessorieAllocateTotal } = storeToRefs(useAccessorieAllocate())
const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()

const limits = ref(50)
const tableLoading = ref(false)
const storeCol = ref()
const filterData = ref({} as Partial<ExpandPage<AccessorieAllocate>>)

function changeStoer() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '配件调拨',
})

/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/accessorie/allocate', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取成品列表 */
const getList = async (where = {} as Partial<AccessorieAllocate>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<AccessorieAllocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getAccessorieAllocate(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<AccessorieAllocate>>(route.fullPath, accessorieAllocateFilterList.value)
  filterData.value = f
  if (f.searchPage)
    searchPage.value = Number(f.searchPage)
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.limits)
    limits.value = Number(f.limits)
  const res = await getList(filterData.value)
  if (filterData.value.id && res?.code !== HttpCode.SUCCESS) {
    $toast.error(res?.message || '搜索失败')
  }
}

/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<AccessorieAllocate>>) => {
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
/** 搜索条码 */
const filterRef = ref()
const search = async (e: string) => {
  filterData.value.id = e
  filterData.value.searchPage = 1
  listJump()
}

/** 清空搜索 */
const clearSearch = async () => {
  delete filterData.value.id
  filterData.value.searchPage = 1
  listJump()
}

async function changeStore() {
  filterData.value.searchPage = 1
  listJump()
}

/** id获取门店名称 */
function getStoreName(id: Stores['id']) {
  const store = storesList.value.find((item: Stores) => item.id === id)
  return store?.name ?? ''
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: accessorieAllocateTotal,
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
try {
  await getStoreList({ page: 1, limit: 20 })
  await changeStoer()
  await getAccessorieAllocateWhere()
  await handleQueryParams()
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
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const val = row.status
      return accessorieAllocateFilterList.value.status?.preset?.[val] ?? '-'
    },
  },
  // 动态字段生成
  ...accessorieAllocateFilterListToArray.value
    .filter(item => item.find)
    .map((item) => {
      return {
        title: item.label,
        key: item.name,
        render(row: any) {
          const value = row[item.name]
          if (item.input === 'text') {
            return value ?? '-'
          }

          if (item.input === 'select') {
            return accessorieAllocateFilterList.value[item.name]?.preset?.[value] ?? '-'
          }

          if (item.input === 'date') {
            if (item.name === 'start_time') {
              return formatTimestampToDateTime(row.created_at)
            }
            if (item.name === 'end_time') {
              return formatTimestampToDateTime(row.updated_at)
            }
            return '-'
          }

          if (item.input === 'search') {
            return getStoreName(value)
          }

          return '-'
        },
      }
    }),
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: any) {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => jump('/product/accessorie/allocate/info', { id: row.id }),
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
      v-model:showtype="showtype" :product-list-total="accessorieAllocateTotal" placeholder="搜索调拨单号" @change-card="changeCard" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <div class="pb-20">
      <template v-if="accessorieAllocateList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="accessorieAllocateList">
            <template #top="{ info }">
              <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
                {{ accessorieAllocateFilterList.status?.preset[info.status] }}
              </div>
            </template>
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-for="(item, index) in accessorieAllocateFilterListToArray" :key="index">
                  <template v-if="item.find">
                    <div class="flex py-[4px] justify-between">
                      <div>
                        {{ item.label }}
                      </div>
                      <template v-if="item.input === 'text'">
                        <div class="val">
                          {{ info[item.name] }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'select'">
                        <div class="val">
                          {{ accessorieAllocateFilterList[item.name]?.preset[info[item.name] as number] }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'date'">
                        <div v-if="item.name === 'start_time'" class="val">
                          {{ formatTimestampToDateTime(info.created_at) }}
                        </div>
                        <div v-if="item.name === 'end_time'" class="val">
                          {{ formatTimestampToDateTime(info.updated_at) }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'search'">
                        <div class="val">
                          {{ getStoreName(info[item.name] as Stores['id']) }}
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump('/product/accessorie/allocate/info', { id: info.id })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="accessorieAllocateTotal" :limit="limits" @update:page="updatePage" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="accessorieAllocateList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>

    <template v-if="myStore.id">
      <common-create @click="jump('/product/accessorie/allocate/add')" />
    </template>

    <common-filter-where ref="filterRef" v-model:show="isFilter" :is-only-show="true" :data="filterData" :filter="accessorieAllocateFilterListToArray" @reset="resetWhere" @submit="submitWhere">
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
