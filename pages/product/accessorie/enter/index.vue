<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { myStoreList, myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()
const { getAccessorieEnterList, getAccessorieEnterWhere, createAccessorieEnter } = useAccessorieEnter()
const { EnterList, EnterToArray, EnterListTotal } = storeToRefs(useAccessorieEnter())
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const isCreateModel = ref(false)
const isBatchImportModel = ref(false)
const enterParams = ref({} as CreateProductFinishedEnter)
const enterStatus = {
  1: '草稿',
  2: '已完成',
  3: '已撤销',
}
/** 门店选择列表 */
const storeCol = ref()
function changeStoer() {
  storeCol.value = []
  enterParams.value.store_id = myStore.value.id
  myStoreList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getMyStore({ page: 1, limit: 20 })
await changeStoer()

useSeoMeta({
  title: '配件入库单',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  await submitWhere({ id: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取货品列表
async function getList(where = {} as Partial<AccessorieEnter>) {
  const params = { page: searchPage.value, limit: limits.value } as ReqList<AccessorieEnter>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getAccessorieEnterList(params)
  return res
}

await getList()
await getAccessorieEnterWhere()

const filterData = ref({} as Partial<AccessorieEnter>)

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}
/** 创建入库单 */
async function createEnter() {
  if (!enterParams.value?.store_id) {
    return $toast.error('请选择门店')
  }
  const res = await createAccessorieEnter(enterParams.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    isCreateModel.value = false
    await getList()
    return $toast.success('添加入库单成功')
  }
  $toast.error(res?.message ?? '添加入库单失败')
}

// 筛选列表
async function submitWhere(f: Partial<AccessorieEnter>, isSearch: boolean = false) {
  filterData.value = { ...f }
  searchPage.value = 1
  EnterList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res?.message ?? '筛选失败')
}

/** 编辑 */
function edit(id: string) {
  jump('/product/accessorie/enter/info', { id })
}

function goAdd() {
  isModel.value = false
  jump('/product/warehouse/add')
}

const filterRef = ref()
async function changeStore() {
  await changeStoer()
  searchPage.value = 1
  filterRef.value.reset()
  await getList()
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: EnterListTotal,
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
  {
    title: '状态',
    key: 'status',
    render(row: AccessorieEnter) {
      return enterStatus[row.status] ?? '-'
    },
  },
  {
    title: '入库单号',
    key: 'id',
    render(row: AccessorieEnter) {
      return row.id
    },
  },
  {
    title: '备注',
    key: 'remark',
    render(row: AccessorieEnter) {
      return row.remark || '-'
    },
  },
  {
    title: '所属门店',
    key: 'store',
    render(row: AccessorieEnter) {
      return row.store?.name || '未知门店'
    },
  },
  {
    title: '入库数量',
    key: 'product_total',
    render(row: AccessorieEnter) {
      return row.product_total
    },
  },
  {
    title: '标签价合计',
    key: 'label_price_total',
    render(row: AccessorieEnter) {
      const total = row.products?.reduce(
        (pre: number, cur: any) => pre + Number(cur?.category?.label_price || 0),
        0,
      )
      return total || 0
    },
  },
  {
    title: '入库时间',
    key: 'created_at',
    render(row: AccessorieEnter) {
      return formatTimestampToDateTime(row?.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: any) {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => jump('/product/accessorie/enter/info', { id: row.id }),
        },
        { default: () => '详情' },
      )
    },
  },
]
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:showtype="showtype" :product-list-total="EnterListTotal" placeholder="搜索入库单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="pb-20">
      <template v-if="EnterList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="EnterList" @edit="edit">
            <template #top="{ info }">
              <div class="enter-title" :class="info.status === 1 ? 'caogao' : info.status === 2 ? 'wancheng' : 'chexiao'">
                {{ enterStatus[info.status] }}
              </div>
            </template>
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                    {{ info.store?.name || '未知门店' }}
                  </div>
                </div>
                <div class="py-[4px] flex justify-between">
                  <div>入库数量</div>
                  <div class="text-align-end">
                    {{ info?.product_total }}
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
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular
                  text="详情" @submit="jump('/product/accessorie/enter/info', { id: info.id })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="EnterListTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="EnterList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <accessorie-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where ref="filterRef" v-model:show="isFilter" :data="filterData" :filter="EnterToArray" @submit="submitWhere" />
    <template v-if="myStore.id">
      <common-create @create="isCreateModel = true" />
    </template>
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
