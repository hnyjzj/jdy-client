<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getProductList, getProductWhere, importProduct } = useProductManage()
const { productList, filterList, filterListToArray, productListTotal } = storeToRefs(useProductManage())
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const pages = ref(1)
const type = ref(1 as Product['type'])
const filterData = ref({} as Partial<Product>)
useSeoMeta({
  title: '成品列表',
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
async function getList(where = {} as Partial<Product>) {
  const params = { page: pages.value, limit: 10 } as ReqList<Product>
  params.where = where
  params.where.type = type.value
  const res = await getProductList(params)
  return res as any
}

try {
  await getList()
  await getProductWhere()
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const create = () => {
  if (!myStore.value?.id) {
    return $toast.error('请先选择门店')
  }
  isModel.value = true
}

function pull() {
  getList(filterData.value)
}

// 提交入库
async function submitGoods(data: Product[]) {
  if (data?.length) {
    if (!myStore.value?.id) {
      return $toast.error('未选择门店，请先选择门店')
    }
    const { code, message } = await importProduct({ products: data, store_id: myStore.value?.id })
    if (code === HttpCode.SUCCESS) {
      isModel.value = false
      isBatchImportModel.value = false
      pages.value = 1
      await getList()
      return $toast.success('导入成功')
    }
    $toast.error(message ?? '导入失败')
  }
}

// 筛选列表
async function submitWhere(f: Partial<Product>, isSearch: boolean = false) {
  filterData.value = { ...f }
  pages.value = 1
  productList.value = []
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
      v-model:id="complate" :product-list-total="productListTotal" placeholder="搜索条码" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="productList?.length">
        <product-list-main :product-list="productList" :filter-list="filterList" @edit="edit" />
        <common-page
          v-model:page="pages" :total="productListTotal" :limit="10" @update:page="() => {
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
    <product-upload-warehouse v-model="isBatchImportModel" :filter-list="filterList" :type="1" @upload="submitGoods" />
    <common-create @click="create" />
    <common-filter-where v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="filterListToArray" @submit="submitWhere" />
  </div>
</template>
