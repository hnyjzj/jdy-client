<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getProductList, getProductWhere } = useProductManage()
const { productList, filterList, filterListToArray, productListTotal } = storeToRefs(useProductManage())
const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
const isCanPull = ref(true)
useSeoMeta({
  title: '报损列表',
})
const openFilter = () => {
  isFilter.value = true
}
// 获取货品列表
async function getList(where = {} as Partial<Product>) {
  if (!isCanPull.value)
    return
  const params = { page: pages.value, limit: 20 } as ReqList<Product>
  where.status = 2
  params.where = where

  const res = await getProductList(params)
  if (res?.data?.list.length) {
    pages.value++
  }
  else {
    isCanPull.value = false
  }
  return res as any
}

await getList()
await getProductWhere()

const filterData = ref({ status: 2, disabled: ['status'] } as Partial<Product>)
function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<Product>) {
  filterData.value = { ...f }
  pages.value = 1
  isCanPull.value = true
  productList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res?.message ?? '筛选失败')
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
    <!-- 小卡片组件 -->
    <div class="pb-10 overflow-hidden">
      <common-list-pull :nomore="!isCanPull" @pull="pull">
        <product-manage-card :list="productList">
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <div class="flex-between">
                <div>
                  旧料条码
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
                  {{ filterList.class?.preset[info.class] }}
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
                  {{ filterList.brand?.preset[info.brand] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  供应商
                </div>
                <div class="text-align-end">
                  {{ filterList.supplier?.preset[info.supplier] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  材质
                </div>
                <div class="text-align-end">
                  {{ filterList.material?.preset[info.material] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  成色
                </div>
                <div class="text-align-end">
                  {{ filterList.quality?.preset[info.quality] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  宝石
                </div>
                <div class="text-align-end">
                  {{ filterList.gem?.preset[info.gem] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  品类
                </div>
                <div class="text-align-end">
                  {{ info.style }}
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
              <common-button-irregular text="详情" @click="jump('/product/finished/info', { code: info.code })" />
            </div>
          </template>
        </product-manage-card>
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />
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
