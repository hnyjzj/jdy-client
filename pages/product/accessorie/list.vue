<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getAccessorieList, getAccessorieWhere } = useAccessorie()
const { accessorieList, accessorieFilterListToArray, accessorieListTotal } = storeToRefs(useAccessorie())
const { getAccessorieCategoryWhere } = useAccessorieCategory()
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)

// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const type = ref(2 as ProductAccessories['type'])
useSeoMeta({
  title: '配件列表',
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
async function getList(where = {} as Partial<ProductAccessories>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<ProductAccessories>
  where.store_id = myStore.value?.id
  params.where = where
  try {
    const res = await getAccessorieList(params)
    tableLoading.value = false
    return res as any
  }
  catch (error) {
    tableLoading.value = false
    $toast.error(error as string)
  }
}

try {
  if (myStore.value.id || myStore.value.id === '') {
    getAccessorieCategoryWhere()
    await getList()
    await getAccessorieWhere()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterData = ref({} as Partial<ProductAccessories>)

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductAccessories>, isSearch: boolean = false) {
  filterData.value = { ...f }
  searchPage.value = 1
  accessorieList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res.message ?? '失败')
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
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
  itemCount: accessorieListTotal,
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
  // 动态生成：来自 categoryFilterListToArray 的字段
  ...categoryFilterListToArray.value
    .filter(item => item.create)
    .map(item => ({
      title: item.label,
      key: item.name,
      render(row: any) {
        if (item.input === 'select') {
          return item.preset?.[row.category?.[item.name]] ?? '-'
        }
        else if (item.name === 'code') {
          return row.code ?? '-'
        }
        else {
          return row.category?.[item.name] ?? '-'
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
        { style: 'display: flex; justify-content: flex-end;' },
        [
          h(
            NButton,
            {
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
      v-model:showtype="showtype" :product-list-total="accessorieListTotal" placeholder="搜索条码" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="accessorieList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="accessorieList">
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-for="(item, index) in categoryFilterListToArray" :key="index">
                  <template v-if="item.create">
                    <div class="flex-between">
                      <div>
                        {{ item.label }}
                      </div>
                      <template v-if="item.input === 'select'">
                        <div class="text-align-end val">
                          {{ item.preset[info.category[item.name] as number] }}
                        </div>
                      </template>
                      <template v-else-if="item.name === 'code'">
                        <div class="text-align-end val">
                          {{ info.code }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-align-end val">
                          {{ info.category[item.name] }}
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
                <div class="flex-between">
                  <div>
                    库存
                  </div>
                  <div class="text-align-end val">
                    {{ info.stock }}
                  </div>
                </div>
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump(`/product/accessorie/info`, { id: info.id })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="accessorieListTotal" :limit="limits" @update:page="pull
            " />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="accessorieList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="accessorieFilterListToArray" @submit="submitWhere" />
  </div>
</template>
