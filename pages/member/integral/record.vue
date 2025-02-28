<script setup lang="ts">
const { $toast } = useNuxtApp()

const route = useRoute()

const page = ref(1)
const nomore = ref(true)

const isFilter = ref(false)
const filterData = ref({} as Partial<IntegralRecord>)

const { getIntegralRecord, getIntegralWhere, getMemberInfo } = useMemberManage()
const { integralRecord, filterIntegralListToArray, integralRecordTotal, memberInfo, searchPage } = storeToRefs(useMemberManage())

const memberParams = ref<Member>({} as Member)
async function getInfo() {
  if (route.query.id) {
    await getMemberInfo(route.query.id as string)
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await getInfo()

const memberName = () => {
  return memberParams.value.name ?? '会员积分记录'
}

useSeoMeta({
  title: () => `${memberName()}`,
})

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

const updatePage = async (page: number) => {
  searchPage.value = page
  await getIntegral()
}
</script>

<template>
  <div class="flex flex-col">
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9] z-1">
      <div class="flex items-center justify-between px-[16px] py-[24px] col-12" uno-lg="col-8 offset-2">
        <div class="flex items-center gap-[8px] font-size-[14px] text-color-#fff">
          <span>
            <span>当前会员</span>
            <span class="px-[2px] font-600">{{ memberName() }}</span>
            <span>共</span>
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

    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterIntegralListToArray" @submit="submitWhere" />

    <div class="px-[16px]">
      <member-integral-record :data="integralRecord" />
      <template v-if="integralRecordTotal !== 0">
        <common-page v-model:page="searchPage" :total="integralRecordTotal" :limit="12" @update:page="updatePage" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
