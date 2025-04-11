<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getProductHistory, getHistoryWhere } = useProductManage()
const { getFinishedWhere } = useFinished()
const { historyFilterList, historyListTotal, productRocordList, HistoryFilterListToArray } = storeToRefs(useProductManage())
const { finishedFilterList } = storeToRefs(useFinished())

const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList, getMyStore } = useStores()

const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
const storeCol = ref()
function changeStore() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
useSeoMeta({
  title: '货品记录',
})

const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  await submitWhere({ product_id: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取货品列表
async function getList(where = {} as Partial<HistoryWhere>) {
  const params = { page: pages.value, limit: 10 } as ReqList<HistoryWhere>
  params.where = where
  if (myStore.value.id) {
    where.store_id = myStore.value.id
    where.type = [1, 2]
  }
  const res = await getProductHistory(params)
  return res as any
}
try {
  await getList()
  await getHistoryWhere()
  await getFinishedWhere()
  await changeStore()
  await getStoreList({ page: 1, limit: 20 })
  await getMyStore({ page: 1, limit: 20 })
}
catch (error) {
  $toast.error('初始化数据失败')
  console.error('初始化数据失败:', error)
}

const filterData = ref({} as Partial<ProductHistories>)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<HistoryWhere>, isSearch: boolean = false) {
  filterData.value = { ...f }
  pages.value = 1
  productRocordList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res.message ?? '筛选失败')
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" v-model:search="searchKey" :product-list-total="historyListTotal" placeholder="搜素关联产品单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-10">
      <template v-if="productRocordList?.length">
        <product-manage-card :list="productRocordList">
          <template #top="{ info }">
            <div>{{ historyFilterList.action?.preset[info.action] }}</div>
          </template>
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <div class="flex-between">
                <div>
                  操作时间
                </div>
                <div class="text-align-end">
                  {{ formatTimestampToDateTime(info.updated_at) }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  关联单号
                </div>
                <div class="text-align-end">
                  {{ info.source_id }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  所属大类
                </div>
                <div class="text-align-end">
                  {{ finishedFilterList.class?.preset[info?.new_value?.class] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  所属门店
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.store?.name }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  条码
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.code }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  货品名称
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.name }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  入网费
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.access_fee }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  零售方式
                </div>
                <div class="text-align-end">
                  {{ finishedFilterList.retail_type?.preset[info?.new_value?.retail_type] }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  标签价
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.label_price }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  零售工费
                </div>
                <div class="text-align-end">
                  {{ info?.new_value?.labor_fee }}
                </div>
              </div>
              <div class="flex-between">
                <div>
                  供应商
                </div>
                <div class="text-align-end">
                  {{ finishedFilterList.supplier?.preset[info?.new_value?.supplier] }}
                </div>
              </div>
            </div>
          </template>
          <template #bottom="{ info }">
            <div class="flex-end text-size-[14px]">
              <common-button-irregular text="详情" @click="jump('/product/history/info', { id: info?.id })" />
            </div>
          </template>
        </product-manage-card>
        <common-page
          v-model:page="pages" :total="historyListTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>

      <common-filter-where v-model:show="isFilter" :data="filterData" :filter="HistoryFilterListToArray" @submit="submitWhere" />
    </div>
  </div>
</template>
