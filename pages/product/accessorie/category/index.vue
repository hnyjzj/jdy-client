<script setup lang="ts">
const { $toast } = useNuxtApp()
const { categoryListTotal, categoryList, categoryFilterListToArray, categoryFilterList } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryList, getAccessorieCategoryWhere, addAccessorieCategory } = useAccessorieCategory()
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)
// 筛选框显示隐藏
const isFilter = ref(false)
const isChooseModel = ref(false)
const isImportModel = ref(false)
const loading = ref(false)
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
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<AccessorieCategory>
  params.where = where
  try {
    const res = await getAccessorieCategoryList(params)
    tableLoading.value = false
    return res as any
  }
  catch (error) {
    tableLoading.value = false
    $toast.error(error as string)
  }
}

try {
  await getList()
  await getAccessorieCategoryWhere()
}
catch (error) {
  throw new Error(`初始化失败: ${error || '未知错误'}`)
}

const filterData = ref({} as AccessorieCategory)

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<AccessorieCategory>, isSearch: boolean = false) {
  filterData.value = { ...f } as AccessorieCategory
  searchPage.value = 1
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

function goAdd() {
  jump('/product/accessorie/category/add')
}

async function bulkupload(e: AccessorieCategory[]) {
  if (!e.length) {
    return $toast.error('数据格式不正确，请添加配件条目')
  }
  loading.value = true
  const res = await addAccessorieCategory({ list: e })
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功', 1000)
    await getAccessorieCategoryList({ page: 1, limit: 10 })
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
  loading.value = false
  isImportModel.value = false
}

const filterRef = ref()
async function changeStore() {
  searchPage.value = 1
  filterRef.value.reset()
  await getList()
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: categoryListTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    pull(1)
  },
  onChange: (page: number) => {
    pull(page)
  },
})

const cols = [
  ...categoryFilterListToArray.value
    .filter(item => item.create)
    .map(item => ({
      title: item.label,
      key: item.name,
      render(row: any) {
        if (['text', 'number', 'textarea'].includes(item.input)) {
          return row[item.name] ?? '-'
        }
        else if (item.input === 'select') {
          return item.preset?.[row[item.name]] ?? '-'
        }
        else {
          return '-'
        }
      },
    })),
]
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype" :product-list-total="categoryListTotal" placeholder="搜索条码" :show-company="false" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 列表 -->
    <div class="px-[16px] pb-20">
      <template v-if="categoryList?.length">
        <template v-if="showtype === 'list'">
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

                      <template v-else-if="item.input === 'select'">
                        <div class="text-align-end val">
                          {{ item.preset[(info[item.name] as number)] }}
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="categoryListTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="categoryList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <common-loading v-model="loading" title="正在处理中" />
    <common-create @click="isChooseModel = true" />
    <product-upload-choose v-model:is-model="isChooseModel" @go-add="goAdd" @batch="isImportModel = true" />
    <accessorie-warehouse-category v-model="isImportModel" :filter-list="categoryFilterList" :type="1" @upload="bulkupload" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="categoryFilterListToArray" @submit="submitWhere" />
  </div>
</template>
