<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStoreList, myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()
const { getFinishedEnterList, getFinishedEnterWhere, createFinishedEnter } = useFinishedEnter()
const { EnterList, EnterToArray, enterFilterList, EnterListTotal } = storeToRefs(useFinishedEnter())
const { searchPage, showtype } = storeToRefs(usePages())

const route = useRoute()
const searchKey = ref('')

// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isCreateModel = ref(false)
const isBatchImportModel = ref(false)
const enterParams = ref({} as CreateProductFinishedEnter)
const filterData = ref({} as Partial<ExpandPage<FinishedEnter>>)
const enterStatus = {
  1: '草稿',
  2: '已完成',
  3: '已撤销',
}
const limits = ref(50)
const tableLoading = ref(false)

const filterRef = ref()
/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/product/warehouse', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 获取成品列表 */
const getList = async (where = {} as Partial<FinishedEnter>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<FinishedEnter>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  const res = await getFinishedEnterList(params)
  tableLoading.value = false
  return res
}
/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<FinishedEnter>>(route.fullPath, enterFilterList.value)
  filterData.value = f
  if (filterData.value.id) {
    searchKey.value = filterData.value.id
  }
  if (f.searchPage)
    searchPage.value = Number(f.searchPage)
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.limits)
    limits.value = Number(f.limits)
  await getList(filterData.value)
}

/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<FinishedEnter>>) => {
  filterData.value = {
    ...f,
    searchPage: 1,
    limits: limits.value,
  }
  listJump()
}

/** 修改页码 */
const updatePage = (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

// 页面初始化逻辑
onMounted(async () => {
  try {
    if (myStore.value.id || myStore.value.id === '') {
      await getFinishedEnterWhere()
      await handleQueryParams()
    }
    else {
      $toast.error('您尚未分配任何门店，请先添加门店')
    }
  }
  catch (error) {
    throw new Error(`初始化失败: ${error || '未知错误'}`)
  }
})

/** 门店选择列表 */
const storeCol = ref()
function changeStore() {
  storeCol.value = []
  enterParams.value.store_id = myStore.value.id
  myStoreList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getMyStore()
await changeStore()

if (myStore.value && Object.keys(myStore.value).length) {
  enterParams.value.store_id = myStore.value.id
}
else {
  $toast.error('请先选择门店')
}
useSeoMeta({
  title: '入库单',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  filterData.value.id = e
  searchPage.value = 1
  listJump()
}
/** 关闭搜索 */
async function clearSearch() {
  delete filterData.value.id
  searchPage.value = 1
  listJump()
}

/** 切换显示 */
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}

// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}

/** 创建入库单 */
async function createEnter() {
  if (!enterParams.value?.store_id) {
    return $toast.error('请选择门店')
  }
  const res = await createFinishedEnter(enterParams.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    isCreateModel.value = false
    await getList()
    return $toast.success('添加入库单成功')
  }
  $toast.error(res?.message ?? '添加入库单失败')
}

const create = () => {
  isCreateModel.value = true
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add')
}

async function changemyStore() {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: EnterListTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  {
    title: '入库状态',
    key: 'status',
    render(row: FinishedEnter) {
      const statusMap: Record<number, string> = {
        1: '草稿',
        2: '完成',
        3: '撤销',
      }
      return statusMap[row.status] || ''
    },
  },
  { title: '入库单号', key: 'id' },
  { title: '备注', key: 'remark' },
  { title: '所属门店', key: 'store', render: (row: FinishedEnter) => row.store?.name || '-' },
  { title: '入库数量', key: 'product_count' },
  { title: '入网费合计', key: 'product_total_access_fee' },
  { title: '标签价合计', key: 'product_total_label_price' },
  { title: '金重合计', key: 'product_total_weight_metal' },
  { title: '操作人', key: 'operator.nickname' },
  {
    title: '入库时间',
    key: 'created_at',
    render(row: FinishedEnter) {
      return formatTimestampToDateTime(row.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: FinishedEnter) {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        [
          h(
            'span',
            {
              style: {
                color: '#0D6CE4',
                cursor: 'pointer',
                fontWeight: 'bold',
              },
              type: 'info',
              size: 'small',
              onClick: () => jump('/product/warehouse/info', { id: row.id }),
            },
            { default: () => '详情' },
          ),
        ],
      )
    },
  },
]
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="EnterListTotal"
      placeholder="搜索入库单号"
      @change-card="changeCard"
      @filter="openFilter"
      @search="search"
      @clear-search="clearSearch"
    >
      <template #company>
        <product-manage-company @change="changemyStore" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <common-layout-center>
      <div class="pb-20 px-[16px] pt-4">
        <template v-if="EnterList?.length">
          <template v-if="showtype === 'list'">
            <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
              <template v-for="(info, index) in EnterList" :key="index">
                <common-card-list>
                  <template #status>
                    <common-button-status
                      :bg-color="getStatusStyle(info.status, EnterStatusColorMap).backgroundColor"
                      :text="enterStatus[info.status]"
                    />
                  </template>
                  <template #info>
                    <div class="text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                      <div class="py-[4px] flex justify-between">
                        <div>入库单号</div>
                        <div class="text-align-end">
                          {{ info.id }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>备注</div>
                        <div class="text-align-end">
                          {{ info?.remark }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>所属门店</div>
                        <div class="text-align-end">
                          {{ info.store?.name }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>入库数量</div>
                        <div class="text-align-end">
                          {{ info.product_count }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>入网费合计</div>
                        <div class="text-align-end">
                          {{ info.product_total_access_fee }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>标签价合计</div>
                        <div class="text-align-end">
                          {{ info.product_total_label_price }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>金重合计</div>
                        <div class="text-align-end">
                          {{ info.product_total_weight_metal }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>操作人</div>
                        <div class="text-align-end">
                          {{ info?.operator?.nickname }}
                        </div>
                      </div>
                      <div class="py-[4px] flex justify-between">
                        <div>入库时间</div>
                        <div class="text-align-end">
                          {{ formatTimestampToDateTime(info?.created_at) }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <div class="flex-end">
                      <common-button-rounded
                        padding="4px 36px"
                        content="详情" @button-click="jump('/product/warehouse/info', { id: info.id })"
                      />
                    </div>
                  </template>
                </common-card-list>
              </template>
            </div>
            <common-page
              v-model:page="searchPage" :total="EnterListTotal" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-datatable :columns="cols" :list="EnterList" :page-option="pageOption" :loading="tableLoading" />
          </template>
        </template>
        <template v-else>
          <common-empty width="100px" />
        </template>
      </div>
    </common-layout-center>

    <template v-if="myStore.id">
      <common-create @click="create" />
    </template>
    <product-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="EnterToArray" @reset="resetWhere" @submit="submitWhere" />
    <common-model v-model="isCreateModel" title="添加入库单" :show-ok="true" @confirm="createEnter">
      <div class="mb-8 min-h-[60px]">
        <div class="flex items-center mb-4">
          <div class="w-[100px] text-color">
            入库门店：
          </div>
          <n-select
            v-model:value="enterParams.store_id"
            :options="storeCol" disabled
            clearable
            @focus="focus" />
        </div>
        <div class="flex mb-4">
          <div class="w-[100px] pt-2 text-color">
            添加备注：
          </div>
          <n-input v-model:value="enterParams.remark" type="textarea" @focus="focus" />
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.uploadInp {
  --uno: 'text-14px px-[12px] py-[4px] rounded-[36px] flex-between text-color-light bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
  &-right {
    --uno: 'flex items-center py-[6px] px-4 rounded-[36px] text-#FFF';
    background: linear-gradient(to bottom, #1b6ceb, #6da6ff);
    box-shadow: #2927273d 0px 2px 2px 1px;
  }
}
.enter-title {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.caogao {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.wancheng {
  --uno: 'bg-#1b6ceb';
}
.chexiao {
  --uno: 'bg-[#999]';
}
</style>
