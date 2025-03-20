<script setup lang="ts">
const { $toast } = useNuxtApp()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getCheckList, getCheckWhere } = useCheck()
const { checkList, checkFilterList, checkFilterListToArray, checkTotal } = storeToRefs(useCheck())
const { storesList } = storeToRefs(useStores())
const { getStoreList, getMyStore } = useStores()
const storeCol = ref()
async function changeStoer() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getStoreList({ page: 1, limit: 20 })
await getMyStore({ page: 1, limit: 20 })
await changeStoer()
await getCheckWhere()
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
useSeoMeta({
  title: '货品盘点',
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
async function getList(where = {} as Partial<Check>) {
  const params = { page: pages.value, limit: 10 } as ReqList<Check>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getCheckList(params)
  return res as any
}

await getList()

const filterData = ref({} as Partial<Check>)

function pull() {
  if (pages.value === 1) {
    return
  }
  getList(filterData.value)
}
const store_id = ref()
// 筛选列表
async function submitWhere(f: Partial<Check>, isSearch = false) {
  if (store_id.value) {
    f.store_id = store_id.value
  }
  filterData.value = { ...f, ...filterData.value }
  pages.value = 1
  checkList.value = []
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

/** 多选值 */
function getMultipleVal(preset: FilterWhere<Check>['preset'], val: any) {
  if (!preset && !val) {
    return ''
  }
  if (!val || val.length === 0)
    return ''
  let str = ''
  val.forEach((item: number) => {
    str = `${str}${preset[item] ? preset[item] : ''}`
  })
  return str
}

/** 单选值 */
function getRadioVal(preset: FilterWhere<Check>['preset'], val: any) {
  if (!val)
    return ''

  if (preset[val]) {
    return preset[val]
  }

  return ''
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <div id="header" class="sticky top-0 bg-[#3875C5] z-1">
      <product-filter
        v-model:id="complate" :product-list-total="checkTotal" placeholder="搜索盘点单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
        <template #company>
          <product-manage-company />
        </template>
      </product-filter>
    </div>
    <!-- 小卡片组件 -->
    <div class="px-[16px] pb-20">
      <template v-if="checkList?.length">
        <product-manage-card :list="checkList">
          <template #top="{ info }">
            <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
              {{ checkFilterList.status?.preset[info.status] }}
            </div>
          </template>
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-for="(item, index) in checkFilterListToArray" :key="index">
                <template v-if="item.input === 'text'">
                  <div class="flex py-[4px] justify-between">
                    <div>
                      {{ item.label === 'ID' ? '盘点单号' : item.label }}
                    </div>
                    <div class="text-align-end">
                      {{ info[item.name] }}
                    </div>
                  </div>
                </template>
                <template v-if="item.input === 'select'">
                  <div class="flex py-[4px] justify-between">
                    <div>
                      {{ item.label }}
                    </div>
                    <div class="text-align-end">
                      {{ getRadioVal(item.preset, info[item.name]) }}
                    </div>
                  </div>
                </template>
                <template v-if="item.input === 'multiple'">
                  <div class="flex py-[4px] justify-between">
                    <div>
                      {{ item.label }}
                    </div>
                    <div class="text-align-end">
                      {{ getMultipleVal(item?.preset, info[item.name]) }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </template>
          <template #bottom="{ info }">
            <div class="flex-end text-size-[14px]">
              <common-button-irregular text="详情" @click="jump('/product/check/info', { id: info.id })" />
            </div>
          </template>
        </product-manage-card>
        <common-page
          v-model:page="pages" :total="checkTotal" :limit="10" @update:page="() => {
            pull()
          }
          " />
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <product-manage-bottom />
    <div class="cursor-pointer">
      <common-create @click="jump('/product/check/add')" />
    </div>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="checkFilterListToArray" @submit="submitWhere">
      <template #inspector_id>
        <n-select
          v-model:value="filterData.inspector_id"
          placeholder="请选择审核人"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
        />
      </template>
      <template #inventory_person_id>
        <n-select
          v-model:value="filterData.inventory_person_id"
          placeholder="请选择盘点人"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          clearable
          remote
          @focus="() => { getStoreStaffList({ id: myStore.id }) }"
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
