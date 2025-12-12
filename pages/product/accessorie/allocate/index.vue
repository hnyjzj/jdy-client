<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getAccessorieAllocate, getAccessorieAllocateWhere, getAccessorieAllocateDetaills } = useAccessorieAllocate()
const { accessorieAllocateList, accessorieAllocateFilterListToArray, accessorieAllocateFilterList, accessorieAllocateTotal } = storeToRefs(useAccessorieAllocate())
const { myStoreList, myStore, StoreStaffList } = storeToRefs(useStores())
const { getMyStore, getStoreStaffList } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())
const { getRegionList } = useRegion()
const { regionList } = storeToRefs(useRegion())
const { getAccessorieWhere } = useAccessorie()
const { accessorieFilterListToArray } = storeToRefs(useAccessorie())
const route = useRoute()
const searchKey = ref('')

const limits = ref(50)
const tableLoading = ref(false)
const storeCol = ref()
const filterData = ref({} as Partial<ExpandPage<AccessorieAllocate>>)
const regionCol = ref()
const isLoading = ref(false)
const staffCol = ref()

function changeRegion() {
  regionCol.value = []
  regionList.value.forEach((item: Region) => {
    regionCol.value.push({ label: item.name, value: item.id })
  })
}

function changeStoer() {
  storeCol.value = []
  myStoreList.value.forEach((item: Stores) => {
    storeCol.value.push({
      label: `${item.name}${item.alias ? `（${item.alias}）` : ''}`,
      value: item.id,
    })
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
  if (filterData.value.id) {
    searchKey.value = filterData.value.id
  }
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

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
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

function initStaffCol() {
  staffCol.value = []
  StoreStaffList.value.forEach((item: StoresStaff) => {
    staffCol.value.push({ label: item.nickname, value: item.id })
  })
}

try {
  await getMyStore()
  await getStoreStaffList({ id: myStore.value.id })
  await changeStoer()
  await getRegionList({ page: 1, limit: 20 })
  await changeRegion()
  await getAccessorieAllocateWhere()
  await getAccessorieWhere()
  await initStaffCol()
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
  // 动态字段生成
  ...accessorieAllocateFilterListToArray.value
    .filter(item => item.info)
    .map((item) => {
      return {
        title: item.label,
        key: item.name,
        render(row: any) {
          let value = row[item.name]
          if (item.name === 'to_store_id') {
            value = row.to_store?.alias
          }
          if (item.name === 'from_store_id') {
            value = row.from_store?.alias
          }
          if (item.name === 'to_region_id') {
            value = row.to_region?.name
          }
          if (item.name === 'receiver_id') {
            value = row.receiver?.nickname
          }
          if (item.name === 'initiator_id') {
            value = row.initiator?.nickname
          }
          if (item.input === 'text') {
            return value ?? '-'
          }

          if (item.input === 'select') {
            return accessorieAllocateFilterList.value[item.name]?.preset?.[value] ?? '-'
          }

          if (item.type === 'date') {
            if (value) {
              return formatTimestampToDateTime(value)
            }
            return '-'
          }
          return value ?? '-'
        },
      }
    }),
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: any) {
      return h(
        'span',
        {
          style: {
            color: '#0D6CE4',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          type: 'info',
          size: 'small',
          onClick: () => jump('/product/accessorie/allocate/info', { id: row.id }),
        },
        { default: () => '详情' },
      )
    },
  },
]

async function downloadDetails() {
  const params = { page: 1, limit: 20, where: { ...filterData.value } } as ReqList<AccessorieAllocate>
  if (!filterData.value?.start_time || !filterData.value?.end_time) {
    return $toast.error('请先在高级筛选内选择时间范围')
  }
  const res = await getAccessorieAllocateDetaills(params)
  if (res?.code !== 200) {
    return $toast.error(res?.message || '获取调拨明细失败')
  }
  if (!res?.data?.length) {
    return $toast.error('暂无调拨明细')
  }
  isLoading.value = true
  try {
    const product = res.data.map(item => item.product ?? []) as ProductAccessories[]
    /** id冲突更改属性名 删除配件的状态 */
    const newProduct = product.map(({ id, status, ...rest }) => ({
      code: id,
      ...rest,
    }))
    const newFields = accessorieFilterListToArray.value.map(field => ({
      ...field,
      name: field.name === 'id' ? 'code' : field.name,
    }))

    exportToXlsxMultiple([res.data, newProduct], [...newFields, ...accessorieAllocateFilterListToArray.value], { ...checkHeaderMap, ...accessorieHeaderMap }, '配件调拨单据')
  }
  finally {
    isLoading.value = false
  }
}

async function focus() {
  await getStoreStaffList({ id: myStore.value.id })
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="accessorieAllocateTotal"
      placeholder="搜索调拨单号"
      :is-export="true"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
      @export="downloadDetails"
    >
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <common-layout-center>
      <div class="pb-20 px-4 pt-4">
        <template v-if="accessorieAllocateList?.length">
          <template v-if="showtype === 'list'">
            <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
              <template v-for="(info, index) in accessorieAllocateList" :key="index">
                <common-card-list>
                  <template #top />
                  <template #status>
                    <div class="status-title" :style="getStatusStyle(info.status, AllocateStatusColorMap)">
                      {{ accessorieAllocateFilterList.status?.preset[info.status] }}
                    </div>
                  </template>
                  <template #info>
                    <div class="text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                      <template v-for="(item, i) in accessorieAllocateFilterListToArray" :key="i">
                        <template v-if="item.info">
                          <div class="flex py-[2px] justify-between">
                            <div>
                              {{ item.label }}
                            </div>
                            <template v-if="item.type === 'date'">
                              <div class="val">
                                {{ info[item.name] ? formatTimestampToDateTime(info[item.name] as string || '') : '' }}
                              </div>
                            </template>
                            <template v-else-if="item.name === 'product_count'">
                              <div class="val">
                                {{ info?.product_count }}
                              </div>
                            </template>
                            <template v-else-if="item.name === 'product_total'">
                              <div class="val">
                                {{ info?.product_total }}
                              </div>
                            </template>
                            <template v-else>
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
                              <template v-else-if="item.input === 'search'">
                                <template v-if="item.name === 'to_region_id'">
                                  <div class="val">
                                    {{ info?.to_region?.name || '' }}
                                  </div>
                                </template>
                                <template v-if="item.name === 'to_store_id'">
                                  <div class="val">
                                    {{ info?.to_store?.alias || '' }}
                                  </div>
                                </template>
                                <template v-if="item.name === 'from_store_id'">
                                  <div class="val">
                                    {{ info?.from_store?.alias || '' }}
                                  </div>
                                </template>
                                <template v-if="item.name === 'receiver_id'">
                                  <div class="val">
                                    {{ info?.receiver?.nickname || '' }}
                                  </div>
                                </template>
                                <template v-if="item.name === 'initiator_id'">
                                  <div class="val">
                                    {{ info?.initiator?.nickname || '' }}
                                  </div>
                                </template>
                              </template>
                            </template>
                          </div>
                        </template>
                      </template>
                    </div>
                  </template>
                  <template #footer>
                    <div class="flex-end">
                      <common-button-rounded padding="4px 36px" content="详情" @button-click="jump('/product/accessorie/allocate/info', { id: info.id })" />
                    </div>
                  </template>
                </common-card-list>
              </template>
            </div>
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
    </common-layout-center>
    <template v-if="myStore.id">
      <common-create @click="jump('/product/accessorie/allocate/add')" />
    </template>
    <common-loading v-model="isLoading" />

    <common-filter-where ref="filterRef" v-model:show="isFilter" :is-only-show="true" :data="filterData" :filter="accessorieAllocateFilterListToArray" @reset="resetWhere" @submit="submitWhere">
      <template #from_store_id>
        <n-select
          v-model:value="filterData.from_store_id"
          menu-size="large"
          filterable
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
          filterable
          placeholder="选择调入门店"
          :options="storeCol"
          clearable
          @focus="() => {
            getMyStore()
          }"
        />
      </template>
      <template #to_region_id>
        <n-select
          v-model:value="filterData.to_region_id"
          menu-size="large"
          placeholder="选择调入区域"
          :options="regionCol"
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
  --uno: 'px-2 py-1 rounded-[8px] text-#FFF';
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
