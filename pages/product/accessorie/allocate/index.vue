<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getAccessorieAllocate, getAccessorieAllocateWhere } = useAccessorieAllocate()
const { accessorieAllocateList, accessorieAllocateFilterListToArray, accessorieAllocateFilterList, accessorieAllocateTotal } = storeToRefs(useAccessorieAllocate())
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
await getAccessorieAllocateWhere()
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
useSeoMeta({
  title: '配件调拨',
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
async function getList(where = {} as Partial<AccessorieAllocate>) {
  const params = { page: pages.value, limit: 10 } as ReqList<AccessorieAllocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getAccessorieAllocate(params)
  return res as any
}

await getList()

const filterData = ref({} as Partial<AccessorieAllocate>)

function pull() {
  getList(filterData.value)
}
// 筛选列表
async function submitWhere(f: Partial<AccessorieAllocate>, isSearch: boolean = false) {
  filterData.value = { ...filterData.value, ...f }
  pages.value = 1
  accessorieAllocateList.value = []
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

const filterRef = ref()
async function changeStore() {
  pages.value = 1
  filterRef.value.reset()
  await getList()
}

/** id获取门店名称 */
function getStoreName(id: Stores['id']) {
  const store = storesList.value.find((item: Stores) => item.id === id)
  return store?.name ?? ''
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" :product-list-total="accessorieAllocateTotal" placeholder="搜索调拨单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
      <template #company>
        <product-manage-company @change="changeStore" />
      </template>
    </product-filter>
    <div class="px-[16px] pb-20">
      <template v-if="accessorieAllocateList?.length">
        <product-manage-card :list="accessorieAllocateList">
          <template #top="{ info }">
            <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
              {{ accessorieAllocateFilterList.status?.preset[info.status] }}
            </div>
          </template>
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-for="(item, index) in accessorieAllocateFilterListToArray" :key="index">
                <template v-if="item.find">
                  <div class="flex py-[4px] justify-between">
                    <div>
                      {{ item.label }}
                    </div>
                    <template v-if="item.input === 'text'">
                      <div class="val">
                        {{ info[item.name] }}
                      </div>
                    </template>
                    <template v-else-if="item.input === 'select'">
                      <div class="val">
                        {{ accessorieAllocateFilterList[item.name]?.preset[info[item.name] as number] }}
                      </div>
                    </template>
                    <template v-else-if="item.input === 'date'">
                      <div v-if="item.name === 'start_time'" class="val">
                        {{ formatTimestampToDateTime(info.created_at) }}
                      </div>
                      <div v-if="item.name === 'end_time'" class="val">
                        {{ formatTimestampToDateTime(info.updated_at) }}
                      </div>
                    </template>
                    <template v-else-if="item.input === 'search'">
                      <div class="val">
                        {{ getStoreName(info[item.name] as Stores['id']) }}
                      </div>
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </template>
          <template #bottom="{ info }">
            <div class="flex-end text-size-[14px]">
              <common-button-irregular text="详情" @click="jump('/product/accessorie/allocate/info', { id: info.id })" />
            </div>
          </template>
        </product-manage-card>
        <common-page
          v-model:page="pages" :total="accessorieAllocateTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <product-manage-bottom />
    <common-create @click="jump('/product/accessorie/allocate/add')" />

    <common-filter-where ref="filterRef" v-model:show="isFilter" :is-only-show="true" :data="filterData" :filter="accessorieAllocateFilterListToArray" @submit="submitWhere" @reset="filterData = {}">
      <template #from_store_id>
        <n-select
          v-model:value="filterData.from_store_id"
          menu-size="large"
          filterable
          placeholder="选择调出门店"
          :options="storeCol"
          @focus="focus"

        />
      </template>
      <template #to_store_id>
        <n-select
          v-model:value="filterData.to_store_id"
          menu-size="large"
          filterable
          placeholder="选择调入门店"
          :options="storeCol"
          @focus="focus"
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
