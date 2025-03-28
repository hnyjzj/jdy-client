<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getAccessorieList, getAccessorieWhere } = useAccessorie()
const { categoryList, categoryListTotal } = storeToRefs(useAccessorieCategory())
const { accessorieFilterListToArray } = storeToRefs(useAccessorie())
const { getAccessorieCategoryList } = useAccessorieCategory()
await getAccessorieCategoryList({ page: 1, limit: 1 })
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
const type = ref(2 as ProductAccessories['type'])
useSeoMeta({
  title: '配件条目',
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
  const params = { page: pages.value, limit: 10 } as ReqList<ProductAccessories>
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

const filterData = ref({} as Partial<ProductAccessories>)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductAccessories>, isSearch: boolean = false) {
  filterData.value = { ...f }
  pages.value = 1
  categoryList.value = []
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

function create() {
  jump('/product/accessorie/category/add')
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" :product-list-total="categoryListTotal" placeholder="搜索条码" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="categoryList?.length">
        <!-- <product-list-main :product-list="categoryList" :filter-list="categoryFilterList" @edit="edit" /> -->
        <common-page
          v-model:page="pages" :total="categoryListTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-create @click="create" />
    <product-manage-bottom />
    <common-filter-where v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="accessorieFilterListToArray" @submit="submitWhere" />
  </div>
</template>
