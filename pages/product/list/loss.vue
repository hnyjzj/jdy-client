<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { getLossList, getLossWhere } = useLoss()
const { lossList, lossFilterList, lossFilterListToArray, lossListTotal } = storeToRefs(useLoss())
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)
// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '报损列表',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  await submitWhere({ code: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取货品列表
async function getList(where = {} as Partial<ProductFinisheds>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<ProductFinisheds>
  params.where = where
  const res = await getLossList(params)
  tableLoading.value = false
  return res as any
}

try {
  await getList()
  await getLossWhere()
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterData = ref({} as Partial<ProductFinisheds>)
const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductFinisheds>, isSearch: boolean = false) {
  filterData.value = { ...f }
  searchPage.value = 1
  lossList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res?.message ?? '筛选失败')
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
  itemCount: lossListTotal,
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
            NButton,
            {
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
      :product-list-total="lossListTotal"
      placeholder="搜索条码"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="pb-20">
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
                <common-button-irregular text="详情" @click="jump('/product/manage/loss/info', { code: info.code })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="lossListTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="lossList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['status']" :filter="lossFilterListToArray" @submit="submitWhere" />
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
