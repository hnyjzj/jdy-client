<script setup lang="ts">
import { NButton } from 'naive-ui'

const { myStore } = storeToRefs(useStores())
const { getLossList, getLossWhere } = useLoss()
const { lossList, lossFilterList, lossFilterListToArray, lossListTotal } = storeToRefs(useLoss())
const { searchPage, showtype } = storeToRefs(usePages())
useSeoMeta({
  title: '报损列表',
})
// 筛选框显示隐藏
const isFilter = ref(false)

const route = useRoute()
const searchKey = ref('')
const filterData = ref({} as Partial<ExpandPage<ProductFinisheds>>)
const limits = ref(50)
const tableLoading = ref(false)
useSeoMeta({
  title: '报损列表',
})
const filterRef = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/list/loss', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取成品列表 */
const getList = async (where = {} as Partial<ProductFinisheds>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<ProductFinisheds>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getLossList(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<ProductFinisheds>>(route.fullPath, lossFilterList.value)
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

/** 门店切换刷新 */
const changeStore = async () => {
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

try {
  await getLossWhere()
  await handleQueryParams()
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: lossListTotal,
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
    title: '条码',
    key: 'code',
  },
  {
    title: '所属大类',
    key: 'class',
    render(row: ProductFinisheds) {
      return lossFilterList.value.class?.preset?.[row.class] ?? '-'
    },
  },
  {
    title: '货品名称',
    key: 'name',
  },
  {
    title: '货品品牌',
    key: 'brand',
    render(row: ProductFinisheds) {
      return lossFilterList.value.brand?.preset?.[row.brand] ?? '-'
    },
  },
  {
    title: '供应商',
    key: 'supplier',
    render(row: ProductFinisheds) {
      return lossFilterList.value.supplier?.preset?.[row.supplier] ?? '-'
    },
  },
  {
    title: '材质',
    key: 'material',
    render(row: ProductFinisheds) {
      return lossFilterList.value.material?.preset?.[row.material] ?? '-'
    },
  },
  {
    title: '成色',
    key: 'quality',
    render(row: ProductFinisheds) {
      return lossFilterList.value.quality?.preset?.[row.quality] ?? '-'
    },
  },
  {
    title: '宝石',
    key: 'gem',
    render(row: ProductFinisheds) {
      return lossFilterList.value.gem?.preset?.[row.gem] ?? '-'
    },
  },
  {
    title: '品类',
    key: 'category',
    render(row: ProductFinisheds) {
      return lossFilterList.value.category?.preset?.[row.category] ?? '-'
    },
  },
  {
    title: '工艺',
    key: 'craft',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: ProductFinisheds) {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
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
              onClick: () => jump('/product/manage/loss/info', { code: row.code }),
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
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="lossListTotal"
      placeholder="搜索条码"
      :is-export="true"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
    >
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="pb-20 px-4 pt-4">
      <common-layout-center>
        <template v-if="lossList?.length">
          <template v-if="showtype === 'list'">
            <product-manage-card :list="lossList">
              <template #info="{ info }">
                <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                  <div class="flex-between">
                    <div>
                      条码
                    </div>
                    <div class="text-align-end">
                      {{ info.code }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      所属大类
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.class?.preset[info.class] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      货品名称
                    </div>
                    <div class="text-align-end">
                      {{ info.name }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      货品品牌
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.brand?.preset[info.brand] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      供应商
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.supplier?.preset[info.supplier] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      材质
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.material?.preset[info.material] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      成色
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.quality?.preset[info.quality] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      宝石
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.gem?.preset[info.gem] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      品类
                    </div>
                    <div class="text-align-end">
                      {{ lossFilterList.category?.preset[info.category] }}
                    </div>
                  </div>
                  <div class="flex-between">
                    <div>
                      工艺
                    </div>
                    <div class="text-align-end">
                      {{ info.craft }}
                    </div>
                  </div>
                </div>
              </template>
              <template #bottom="{ info }">
                <div class="flex-end text-size-[14px]">
                  <common-button-rounded padding="4px 36px" content="详情" @button-click="jump('/product/manage/loss/info', { code: info.code })" />
                </div>
              </template>
            </product-manage-card>
            <common-page
              v-model:page="searchPage" :total="lossListTotal" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-datatable :columns="cols" :list="lossList" :page-option="pageOption" :loading="tableLoading" />
          </template>
        </template>
        <template v-else>
          <common-empty width="100px" />
        </template>
      </common-layout-center>
    </div>
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['status']" :filter="lossFilterListToArray" @reset="resetWhere" @submit="submitWhere" />
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
</style>
