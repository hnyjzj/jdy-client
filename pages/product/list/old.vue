<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())

const { getProductList, getProductWhere, importProduct } = useProductManage()
const { productList, filterList, filterListToArray, productListTotal } = storeToRefs(useProductManage())
const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const pages = ref(1)
const isCanPull = ref(true)
const type = ref(2)
useSeoMeta({
  title: '旧料列表',
})

const openFilter = () => {
  isFilter.value = true
}
// 获取货品列表
async function getList(where = {} as Partial<Product>) {
  if (!isCanPull.value)
    return
  const params = { page: pages.value, limit: 20 } as ReqList<Product>
  params.where = where
  params.where.type = type.value
  const res = await getProductList(params)
  if (res.data?.list.length) {
    pages.value++
  }
  else {
    isCanPull.value = false
  }
  return res as any
}

await getList()
await getProductWhere()

const filterData = ref({} as Partial<Product>)

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
    const impParams = { products: data, store_id: myStore.value?.id }
    const { code, message } = await importProduct(impParams)

    if (code === HttpCode.SUCCESS) {
      isModel.value = false
      pages.value = 1
      await getList()
      return $toast.success('导入成功')
    }
    $toast.error(message ?? '导入失败')
  }
}

// 筛选列表
async function submitWhere(f: Partial<Product>) {
  filterData.value = { ...f }
  pages.value = 1
  isCanPull.value = true
  productList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res.message ?? '筛选失败')
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
      v-model:id="complate" v-model:search="searchKey" :product-list-total="productListTotal" @filter="openFilter">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="pb-10">
      <common-list-pull @pull="pull">
        <product-list-main :product-list="productList" :filter-list="filterList" @edit="edit" />
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <product-upload-warehouse v-model="isBatchImportModel" :filter-list="filterList" :type="1" @upload="submitGoods" />
    <common-create @click="create" />
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="filterListToArray" @submit="submitWhere" />
  </div>
</template>
