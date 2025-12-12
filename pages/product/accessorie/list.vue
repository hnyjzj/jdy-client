<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getAccessorieList, getAccessorieWhere } = useAccessorie()
const { accessorieList, accessorieFilterListToArray, accessorieFilterList, accessorieListTotal } = storeToRefs(useAccessorie())
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()
const searchKey = ref('')

const limits = ref(50)
const tableLoading = ref(false)
const filterData = ref({} as Partial<ExpandPage<ProductAccessories>>)

// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '配件列表',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
const filterRef = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/accessorie/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取列表 */
const getList = async (where = {} as Partial<ProductAccessories>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<ProductAccessories>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getAccessorieList(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<ProductAccessories>>(route.fullPath, accessorieFilterList.value)
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
const submitWhere = async (f: Partial<ExpandPage<ProductAccessories>>) => {
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
/** 搜索名称 */
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

try {
  if (myStore.value.id || myStore.value.id === '') {
    await getAccessorieWhere()
    await handleQueryParams()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

async function changeStore() {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: accessorieListTotal,
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

const cols = [
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      const val = row.status
      return accessorieFilterList.value.status?.preset?.[val] ?? '-'
    },
  },
  // 动态生成：来自 categoryFilterListToArray 的字段
  ...accessorieFilterListToArray.value
    .filter(item => item.create)
    .map(item => ({
      title: item.label,
      key: item.name,
      render(row: any) {
        if (item.input === 'select') {
          return item.preset?.[row?.[item.name]] ?? '-'
        }
        else {
          return row?.[item.name] ?? '-'
        }
      },
    })),
  // 静态字段：库存
  {
    title: '库存',
    key: 'stock',
  },

  // 操作列
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: any) {
      return h(
        'div',
        [
          h(
            'span',
            {
              style: {
                color: '#0D6CE4',
                cursor: 'pointer',
                fontWeight: 'bold',
              },
              type: 'info',
              size: 'small',
              onClick: () => jump('/product/accessorie/info', { id: row.id }),
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
      v-model:search-key="searchKey"
      v-model:showtype="showtype"
      :product-list-total="accessorieListTotal"
      placeholder="搜索名称"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
    >
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <common-layout-center>
      <div class="pb-20 px-[16px] pt-4">
        <template v-if="accessorieList?.length">
          <template v-if="showtype === 'list'">
            <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
              <template v-for="(info, index) in accessorieList" :key="index">
                <common-card-list>
                  <template #status>
                    <common-button-status
                      :bg-color="getStatusStyle(info.status, AllocateStatusColorMap).backgroundColor"
                      :text="accessorieFilterList.status?.preset[info.status]"
                    />
                  </template>
                  <template #info>
                    <div class="text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                      <template v-for="(item, i) in accessorieFilterListToArray" :key="i">
                        <template v-if="item.info">
                          <div class="flex-between">
                            <div>
                              {{ item.label }}
                            </div>
                            <template v-if="item.name === 'store'">
                              <div class="text-align-end val">
                                {{ info[item.name].name }}
                              </div>
                            </template>
                            <template v-else>
                              <template v-if="item.type === 'date'">
                                <div class="text-align-end val">
                                  {{ info[item.name] ? formatTimestampToDateTime(info[item.name] as string || '') : '' }}
                                </div>
                              </template>
                              <template v-else>
                                <template v-if="item.input === 'select'">
                                  <div class="text-align-end val">
                                    {{ item.preset[info[item.name] || 0] || '' }}
                                  </div>
                                </template>
                                <template v-else>
                                  {{ info[item.name] }}
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
                      <common-button-rounded
                        padding="4px 36px"
                        content="详情" @button-click="jump('/product/accessorie/info', { id: info.id })"
                      />
                    </div>
                  </template>
                </common-card-list>
              </template>
            </div>
            <common-page
              v-model:page="searchPage" :total="accessorieListTotal" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-datatable :columns="cols" :list="accessorieList" :page-option="pageOption" :loading="tableLoading" />
          </template>
        </template>
        <template v-else>
          <common-empty width="100px" />
        </template>
      </div>
    </common-layout-center>
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="accessorieFilterListToArray" @reset="resetWhere" @submit="submitWhere" />
  </div>
</template>
