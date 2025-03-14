<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getAllocate, getAllocateWhere } = useAllocate()
const { allocateList, allocateFilterListToArray, allocateFilterList, allocateTotal } = storeToRefs(useAllocate())
const { storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
const storeCol = ref()
function changeStoer() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getStoreList({ page: 1, limit: 20 })
await changeStoer()
await getAllocateWhere()
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
useSeoMeta({
  title: '货品调拨',
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
async function getList(where = {} as Partial<Allocate>) {
  const params = { page: pages.value, limit: 10 } as ReqList<Allocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getAllocate(params)
  return res as any
}

await getList()

const filterData = ref({} as Partial<Allocate>)

function pull() {
  getList(filterData.value)
}
// 筛选列表
async function submitWhere(f: Partial<Allocate>, isSearch: boolean = false) {
  filterData.value = { ...f, ...filterData.value }
  pages.value = 1
  allocateList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
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
      v-model:id="complate" :product-list-total="allocateTotal" placeholder="搜索调拨单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="px-[16px] pb-20">
      <template v-if="allocateList?.length">
        <product-manage-card :list="allocateList">
          <template #top="{ info }">
            <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
              {{ allocateFilterList.status?.preset[info.status] }}
            </div>
          </template>
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <div class="flex py-[4px] justify-between">
                <div>
                  调拨方式
                </div>
                <div class="val">
                  {{ allocateFilterList.method?.preset[info.method] }}
                </div>
              </div>
              <div class="flex py-[4px] justify-between">
                <div>
                  仓库类型
                </div>
                <div class="val">
                  {{ allocateFilterList.type?.preset[info.type] }}
                </div>
              </div>
              <div class="flex py-[4px] justify-between">
                <div>
                  调拨原因
                </div>
                <div class="val">
                  {{ allocateFilterList.reason?.preset[info.reason] }}
                </div>
              </div>
              <div class="flex py-[4px] justify-between">
                <div>
                  调拨状态
                </div>
                <div class="val">
                  {{ allocateFilterList.status?.preset[info.status] }}
                </div>
              </div>
              <div class="flex py-[4px] justify-between">
                <div>
                  备注
                </div>
                <div class="val">
                  {{ info.remark }}
                </div>
              </div>
              <div class="flex py-[4px] justify-between">
                <div>
                  开始时间
                </div>
                <div class="val">
                  {{ formatTimestampToDateTime(info.created_at) }}
                </div>
              </div>
            </div>
          </template>
          <template #bottom="{ info }">
            <div class="flex-end text-size-[14px]">
              <common-button-irregular text="详情" @click="jump('/product/allocate/info', { id: info.id })" />
            </div>
          </template>
        </product-manage-card>
        <common-page
          v-model:page="pages" :total="allocateTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <product-manage-bottom />
    <common-create @click="jump('/product/allocate/add')" />

    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="allocateFilterListToArray" @submit="submitWhere" @reset="filterData = {}">
      <template #from_store_id>
        <n-select
          v-model:value="filterData.from_store_id"
          menu-size="large"
          filterable
          placeholder="选择调出门店"
          :options="storeCol"
        />
      </template>
      <template #to_store_id>
        <n-select
          v-model:value="filterData.to_store_id"
          menu-size="large"
          filterable
          placeholder="选择调入门店"
          :options="storeCol"
        />
      </template>
    </common-filter-where>
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
.val {
  --uno: 'text-right w-200px';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-title {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.orange {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.bule {
  --uno: 'bg-#1b6ceb';
}
.grey {
  --uno: 'bg-[#999]';
}
</style>
