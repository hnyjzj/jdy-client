<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { categoryListTotal, categoryList, categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryList, getAccessorieCategoryWhere } = useAccessorieCategory()
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const page = ref(1)
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
async function getList(where = {} as Partial<AccessorieCategory>) {
  const params = { page: page.value, limit: 10 } as ReqList<AccessorieCategory>
  params.where = where
  try {
    const res = await getAccessorieCategoryList(params)
    return res as any
  }
  catch (error) {
    $toast.error(error as string)
  }
}

try {
  if (myStore.value?.id) {
    await getList()
    await getAccessorieCategoryWhere()
  }
  else {
    $toast.error('您尚未分配任何门店，请先添加门店')
  }
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterData = ref({} as AccessorieCategory)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<AccessorieCategory>, isSearch: boolean = false) {
  filterData.value = { ...f } as AccessorieCategory
  page.value = 1
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
        <product-manage-card :list="categoryList">
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-for="(item, index) in categoryFilterListToArray" :key="index">
                <template v-if="item.create">
                  <div class="flex-between">
                    <div>
                      {{ item.label }}
                    </div>
                    <template v-if="item.input === 'text' || item.input === 'number' || item.input === 'textarea'">
                      <div class="text-align-end val">
                        {{ info[item.name] }}
                      </div>
                    </template>
                    <template v-else-if="item.input === 'switch'">
                      <n-switch v-model:value="info[item.name]" :style="{ 'border-radius': '20px' }" round />
                    </template>
                    <template v-else-if="item.input === 'select'">
                      <div class="text-align-end val">
                        {{ item.preset[info[item.name]] }}
                      </div>
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </product-manage-card>
        <common-page
          v-model:page="page" :total="categoryListTotal" :limit="10" @update:page="() => {
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
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="categoryFilterListToArray" @submit="submitWhere" />
  </div>
</template>
