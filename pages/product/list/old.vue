<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())

const { getOldList, getOldWhere } = useOld()
const { oldList, oldFilterList, oldFilterListToArray, oldListTotal } = storeToRefs(useOld())
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isBatchImportModel = ref(false)
const pages = ref(1)
const type = ref(2 as ProductOlds['type'],
)
useSeoMeta({
  title: '旧料列表',
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
async function getList(where = {} as Partial<ProductOlds>) {
  const params = { page: pages.value, limit: 10 } as ReqList<ProductOlds>
  params.where = where
  const res = await getOldList(params)
  return res as any
}

try {
  if (myStore.value?.id) {
    await getList()
    await getOldWhere()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterData = ref({} as Partial<ProductOlds>)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<ProductOlds>, isSearch: boolean = false) {
  filterData.value = { ...f }
  pages.value = 1
  oldList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res?.message ?? '失败')
}

/** 编辑 */
function edit(code: string) {
  jump('/product/manage/edit', { code })
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add', { type: type.value })
}

function goInfo(info: ProductOlds) {
  jump('/product/manage/old/info', { id: info.id })
}

async function changeStore() {
  pages.value = 1
  await getList()
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" :product-list-total="oldListTotal" placeholder="搜索条码" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="oldList?.length">
        <product-list-main :product-list="oldList" :filter-list="oldFilterList" @edit="edit" @go-info="goInfo" />
        <common-page
          v-model:page="pages" :total="oldListTotal" :limit="10" @update:page="() => {
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
    <common-filter-where v-model:show="isFilter" :data="filterData" :disabled="['type']" :filter="oldFilterListToArray" @submit="submitWhere" />
  </div>
</template>
