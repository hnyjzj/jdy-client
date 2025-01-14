<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getAllocate, getProductWhere } = useAllocate()
const { allocateList, filterListToArray, allocateTotal } = storeToRefs(useAllocate())
const searchKey = ref('')
const complate = ref(0)
// 筛选框显示隐藏
const isFilter = ref(false)
const isModel = ref(false)
const pages = ref(1)
const isCanPull = ref(true)
useSeoMeta({
  title: '货品管理',
})
const openFilter = () => {
  isFilter.value = true
}
// 获取货品列表
async function getList(where = {} as Partial<Allocate>) {
  if (!isCanPull.value)
    return
  const params = { page: pages.value, limit: 20 } as ReqList<Allocate>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }

  const res = await getAllocate(params)
  if (res.data?.list.length) {
    pages.value++
  }
  else {
    isCanPull.value = false
  }
  return res as any
}

await getList()
await getProductWhere()

// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
  if (height.value) {
    height.value = height.value + 40
  }
})

const filterData = ref({} as Partial<Allocate>)

const create = () => {
  isModel.value = true
}

function pull() {
  getList(filterData.value)
}

// 筛选列表
async function submitWhere(f: Partial<Allocate>) {
  filterData.value = { ...f }
  pages.value = 1
  isCanPull.value = true
  allocateList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res.message ?? '筛选失败')
}

/** 编辑 */
function edit(code: string) {
  jump('/product/manage/edit', { code })
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- 筛选 -->
    <div id="header">
      <product-filter
        v-model:id="complate" v-model:search="searchKey" :product-list-total="allocateTotal" @filter="openFilter">
        <template #company>
          <product-manage-company />
        </template>
      </product-filter>
    </div>
    <!-- 小卡片组件 -->
    <div class="pb-10 overflow-hidden">
      <common-list-pull :distance="height" :nomore="!isCanPull" @pull="pull">
        <product-manage-card :list="allocateList" @edit="edit">
          <template #info="{ info }">
            <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]" @click="jump('/product/goods/allocate/info', { id: info.id })">
              <van-row justify="space-between" class="py-[4px]">
                <van-col span="12">
                  <div class="">
                    所属大类
                  </div>
                </van-col>
                <van-col span="12">
                  <div class="text-align-end">
                    {{ info.created_at }}
                  </div>
                </van-col>
              </van-row>
              <van-row justify="space-between" class="py-[4px]">
                <van-col span="12">
                  <div class="">
                    材质
                  </div>
                </van-col>
                <van-col span="12">
                  <div class="text-align-end">
                    {{ info.deleted_at }}
                  </div>
                </van-col>
              </van-row>
            </div>
          </template>
        </product-manage-card>
      </common-list-pull>
    </div>
    <product-manage-bottom />
    <div class="cursor-pointer">
      <common-create @click="create" />
    </div>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />
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
