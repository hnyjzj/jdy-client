<script setup lang="ts">
import type { Where } from 'where'

const { $toast } = useNuxtApp()
const { getProductList, getProductWhere, importProduct } = useProductManage()
const { productList, filterList, filterListToArray, productListTotal } = storeToRefs(useProductManage())
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
async function getList(where = {} as Where<Product>) {
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

// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
  if (height.value) {
    height.value = height.value + 40
  }
})

const filterData = ref({} as Where<Product>)

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
      return $toast.success('导入成功')
    }
    $toast.error(message ?? '导入失败')
  }
}

// 筛选列表
async function submitWhere(f: Where<Product>) {
  filterData.value = f
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
</script>

<template>
  <div class="overflow-hidden">
    <!-- 筛选 -->
    <div id="header">
      <product-filter
        v-model:id="complate" v-model:search="searchKey" :product-list-total="productListTotal" @filter="openFilter">
        <template #company>
          <product-manage-company />
        </template>
      </product-filter>
    </div>
    <!-- 小卡片组件 -->
    <div class="pb-10 overflow-hidden">
      <common-list-pull :distance="height" :nomore="!isCanPull" @pull="pull">
        <product-manage-card :list="productList" @edit="edit">
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]" @click="jump('/product/finished/list', { code: info.code })">
              <van-row justify="space-between" class="py-[4px]">
                <van-col span="12">
                  <div class="">
                    所属大类
                  </div>
                </van-col>
                <van-col span="12">
                  <div class="text-align-end">
                    {{ filterList.class?.preset[info.class] }}
                  </div>
                </van-col>
              </van-row>
              <van-row justify="space-between" class="py-[4px]">
                <van-col span="12">
                  <div class="">
                    材质
                  </div>
                </van-col>
                <van-col span="12">
                  <div class="text-align-end">
                    {{ filterList.material?.preset[info.class] }}
                  </div>
                </van-col>
              </van-row>
            </div>
          </template>
        </product-manage-card>
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <div class="cursor-pointer">
      <common-create @click="create" />
    </div>
    <common-model v-model="isModel" title="入库" :show-ok="true" confirm-text="导入货品" @confirm="submitGoods">
      <div class="mb-8 relative">
        <input class="h-[40px] absolute top-0 w-full opacity-0" type="file" @change="FileUpload">
        <div class="uploadInp cursor-pointer">
          <div>请添加文件</div>
          <div class="uploadInp-right">
            <icon name="i-svg:upload" size="16" color="#666" />
            <div class="ml-2">
              点击上传
            </div>
          </div>
        </div>
      </div>
    </common-model>
    <product-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere">
      <template #product_enter_id="{ filter }">
        {{ filter.name }}
      </template>
    </product-where>
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
