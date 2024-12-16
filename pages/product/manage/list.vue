<script setup lang="ts">
import type { Where } from 'where'

const { $toast } = useNuxtApp()
const { getProductList, getProductWhere, importProduct } = useProductManage()
const { productList, filterList, filterListToArray } = storeToRefs(useProductManage())
const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const pages = ref(1)
const isCanPull = ref(true)
useSeoMeta({
  title: '货品管理',
})
const openFilter = () => {
  isFilter.value = true
}
// 获取货品列表
async function getList(where = {} as Product) {
  if (!isCanPull.value)
    return
  const params = { page: pages.value, limit: 20 } as ProductReq
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
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

const list = ref({} as Where<Product>)
const create = () => {
  isModel.value = true
}

function pull() {
  getList()
}

// 上传xlsx文件数据
const sheetData = ref([])
/**
 * 上传xlsx文件并解析数据
 * @param event input上传文件
 */
function FileUpload(event: any) {
  uploadXlsx(event).then((data) => {
    sheetData.value = data as never[]
  })
}
/**
 * 将二维数组转换为对象数组
 * @param data 二维数组，第一行是表头，其余是数据行
 * @returns 对象数组
 */
function transformData(data: any[][]) {
  if (!data || data.length < 2) {
    $toast.error('数据格式不正确，至少需要表头和一行数据')
    return []
  }
  // 第一行是表头 对应着字段名
  const headers: ProductKey[] = data[0]
  return data.slice(1).map((row) => {
    const obj = {} as Record<ProductKey, any>
    headers.forEach((header: ProductKey, index) => {
      const type = filterList.value[header]?.type
      switch (type) {
        case 'number':
          row[index] = Number(row[index])
          break
        case 'float':
          row[index] = Number.parseFloat(row[index])
          break
        case 'string':
          row[index] = String(row[index])
          break
        case 'bool':
          row[index] = Boolean(row[index])
          break
        case 'string[]':
          row[index] = JSON.parse(JSON.stringify(row[index]))
          break
        default:
          break
      }
      obj[header] = row[index] ?? '' // 将表头与对应的数据行匹配
    })
    return obj
  })
}

// 提交入库
async function submitGoods() {
  const data: Product[] = transformData(sheetData.value)
  if (data?.length) {
    const { code, message } = await importProduct({ products: data })
    if (code === HttpCode.SUCCESS) {
      isModel.value = false
      $toast.success('导入成功')
    }
    else {
      $toast.error(message ?? '导入失败')
    }
  }
}

// 筛选列表
async function submitWhere(filterParams: Product) {
  pages.value = 1
  isCanPull.value = true
  productList.value = []
  const res = await getList(filterParams)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    $toast.success('筛选成功')
  }
  else {
    $toast.error(res.message ?? '筛选失败')
  }
}
</script>

<template>
  <div class="overflow-hidden">
    <div class="fixed top-0 left-0 right-0">
      <!-- 筛选 -->
      <product-filter
        v-model:id="complate" v-model:search="searchKey" @filter="openFilter">
        <template #company>
          <product-manage-company />
        </template>
      </product-filter>
    </div>
    <!-- 小卡片组件 -->
    <div class="px-[16px] pt-26 pb-16 overflow-hidden">
      <common-list-pull @pull="pull">
        <product-manage-card :product-list="productList" :filter-list="filterList" />
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <div class="cursor-pointer">
      <common-create @click="create" />
    </div>
    <common-model v-model="isModel" title="入库" :show-ok="true" confirm-text="导入货品" @confirm="submitGoods">
      <div class="mb-8">
        <input class="text-color" type="file" @change="FileUpload">
      </div>
    </common-model>
    <product-where v-model="isFilter" :list="list" :filter-list-to-array="filterListToArray" @submit="submitWhere" />
  </div>
</template>
