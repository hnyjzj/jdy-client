<script setup lang="ts">
const { $toast } = useNuxtApp()
const { myStoreList, myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

const { getAccessorieEnterList, getAccessorieEnterWhere, createAccessorieEnter } = useAccessorieEnter()

const { EnterList, EnterToArray, EnterListTotal } = storeToRefs(useAccessorieEnter())
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
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
enterParams.value.store_id = myStore.value.id
function changeStoer() {
  storeCol.value = []
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
  const params = { page: pages.value, limit: 10 } as ReqList<AccessorieEnter>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getAccessorieEnterList(params)
  return res
}

await getList()
await getAccessorieEnterWhere()

const filterData = ref({} as Partial<AccessorieEnter>)

function pull() {
  getList(filterData.value)
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
  pages.value = 1
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
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" :product-list-total="EnterListTotal" placeholder="搜索入库单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="px-[16px] pb-20">
      <template v-if="EnterList?.length">
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
                  {{ info.store.name }}
                </div>
              </div>
              <div class="py-[4px] flex justify-between">
                <div>入库数量</div>
                <div class="text-align-end">
                  {{ info.products?.length || 0 }}
                </div>
              </div>
              <div class="py-[4px] flex justify-between">
                <div>入网费合计</div>
                <div class="text-align-end">
                  {{ info.products?.reduce((pre, cur:ProductFinisheds) => pre + Number(cur?.access_fee), 0) || 0 }}
                </div>
              </div>
              <div class="py-[4px] flex justify-between">
                <div>标签价合计</div>
                <div class="text-align-end">
                  {{ info.products?.reduce((pre, cur:ProductFinisheds) => pre + Number(cur?.label_price), 0) || 0 }}
                </div>
              </div>
              <div class="py-[4px] flex justify-between">
                <div>金重合计</div>
                <div class="text-align-end">
                  {{ info.products?.reduce((pre, cur:ProductFinisheds) => pre + Number(cur?.weight_metal), 0) || 0 }}
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
          v-model:page="pages" :total="EnterListTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <accessorie-upload-choose v-model:is-model="isModel" @go-add="goAdd" @batch="isBatchImportModel = true" />
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="EnterToArray" @submit="submitWhere" />
    <common-create @create="isCreateModel = true" />
    <common-model v-model="isCreateModel" title="添加入库单" :show-ok="true" @confirm="createEnter">
      <div class="mb-8 min-h-[60px]">
        <div class="flex items-center mb-4">
          <div class="w-[100px] text-color">
            入库门店：
          </div>
          <n-select
            v-model:value="enterParams.store_id" :options="storeCol"
            disabled
            clearable />
        </div>
        <div class="flex mb-4">
          <div class="w-[100px] pt-2 text-color">
            添加备注：
          </div>
          <n-input v-model:value="enterParams.remark" type="textarea" />
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
