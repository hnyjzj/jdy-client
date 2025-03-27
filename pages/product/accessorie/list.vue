<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getAccessorieList, getAccessorieWhere } = useAccessorie()
const { accessorieList, accessorieFilterList, accessorieFilterListToArray, accessorieListTotal } = storeToRefs(useAccessorie())
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const pages = ref(1)
const type = ref(2 as ProductFinisheds['type'])
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
async function getList(where = {} as Partial<ProductFinisheds>) {
  const params = { page: pages.value, limit: 10 } as ReqList<ProductFinisheds>
  params.where = where
  params.where.type = type.value
  try {
    const res = await getAccessorieList(params)
    return res as any
  }
  catch (error) {
    $toast.error(error as string)
  }
}

try {
  if (myStore.value?.id) {
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

const filterData = ref({} as Partial<ProductFinisheds>)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductFinisheds>, isSearch: boolean = false) {
  filterData.value = { ...f }
  pages.value = 1
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

/** 编辑 */
function edit(code: string) {
  jump('/product/manage/edit', { code })
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" :product-list-total="accessorieListTotal" placeholder="搜索条码" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="accessorieList?.length">
        <product-list-main :product-list="accessorieList" :filter-list="accessorieFilterList" @edit="edit" />
        <common-page
          v-model:page="pages" :total="accessorieListTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <product-manage-bottom />
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="accessorieFilterListToArray" @submit="submitWhere" />
  </div>
</template>
