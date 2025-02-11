<script setup lang="ts">
useSeoMeta({
  title: '积分记录',
})

// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
  if (height.value) {
    height.value = height.value + 40
  }
})

const { $toast } = useNuxtApp()

const route = useRoute()

const page = ref(1)
const nomore = ref(true)

const isFilter = ref(false)
const filterData = ref({} as Partial<IntegralRecord>)

const { getIntegralRecord, getIntegralWhere } = useMemberManage()
const { integralRecord, filterIntegralListToArray, integralRecordTotal } = storeToRefs(useMemberManage())

async function getIntegral(where = {} as Partial<IntegralRecord>) {
  if (!nomore.value)
    return
  const params = {
    page: page.value,
    limit: 10,
    where: {
      member_id: route.query.id as string,
      ...where,
    },
  } as ReqList<IntegralRecord>

  const res = await getIntegralRecord(params)

  if (res.data?.list.length) {
    page.value++
  }
  else {
    nomore.value = false
  }
  return res as any
}

const openFilter = () => {
  isFilter.value = true
}

await getIntegral()
await getIntegralWhere()

// 筛选列表
async function submitWhere(f: Partial<IntegralRecord>) {
  filterData.value = { ...f }
  page.value = 1
  nomore.value = true
  integralRecord.value = []
  const res = await getIntegral(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res.message ?? '筛选失败')
}

function pull() {
  getIntegral()
}
</script>

<template>
  <div class="overflow-hidden">
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterIntegralListToArray" @submit="submitWhere" />

    <div id="header">
      <div class="grid-12">
        <div class="flex items-center justify-between px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2">
          <div class="flex items-center gap-[8px] font-size-[14px] text-color-#fff">
            <span>
              当前用户共
            </span>
            <span>
              {{ integralRecordTotal }}
            </span>
            <span>
              条数据
            </span>
          </div>

          <div>
            <product-filter-Senior class="color-[#fff]" @filter="openFilter" />
          </div>
        </div>
      </div>
    </div>

    <div class="pb-10 overflow-hidden">
      <common-list-pull :distance="height" :nomore="!nomore" @pull="pull">
        <member-integral-record :data="integralRecord" />
      </common-list-pull>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
