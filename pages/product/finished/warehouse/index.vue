<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getEnterList, getEnterWhere } = useEnter()
const { EnterList, EnterToArray, EnterListTotal } = storeToRefs(useEnter())
const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const pages = ref(1)
const isCanPull = ref(true)
useSeoMeta({
  title: '入库单',
})
const openFilter = () => {
  isFilter.value = true
}
// 获取货品列表
async function getList(where = {} as Partial<Enter>) {
  if (!isCanPull.value)
    return
  const params = { page: pages.value, limit: 20 } as ReqList<Enter>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getEnterList(params)
  if (res?.data?.list.length) {
    pages.value++
  }
  else {
    isCanPull.value = false
  }
  return res
}

await getList()
await getEnterWhere()

const filterData = ref({} as Partial<Enter>)

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<Enter>) {
  filterData.value = { ...f }
  pages.value = 1
  isCanPull.value = true
  EnterList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res?.message ?? '筛选失败')
}

/** 编辑 */
function edit(id: string) {
  jump('/product/finished/warehouse/info', { id })
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" v-model:search="searchKey" :product-list-total="EnterListTotal" @filter="openFilter">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="pb-10">
      <common-list-pull :nomore="!isCanPull" @pull="pull">
        <product-manage-card :list="EnterList" @edit="edit">
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <div class="py-[4px] flex justify-between">
                <div>入库单号</div>
                <div class="text-align-end">
                  {{ info.id }}
                </div>
              </div>
              <div class="py-[4px] flex justify-between">
                <div>入库时间</div>
                <div class="text-align-end">
                  {{ formatTimestampToDateTime(info.created_at) }}
                </div>
              </div>
            </div>
          </template>
          <template #bottom="{ info }">
            <div class="flex-end text-size-[14px]">
              <common-button-irregular text="详情" @click="jump('/product/finished/warehouse/info', { id: info.id })" />
            </div>
          </template>
        </product-manage-card>
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <div class="cursor-pointer">
      <common-create @click="jump('/product/finished/warehouse/add')" />
    </div>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="EnterToArray" @submit="submitWhere" />
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
</style>
