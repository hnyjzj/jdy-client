<script setup lang="ts">
const route = useRoute()

const isFilter = ref(false)
const filterData = ref({} as Partial<IntegralRecord>)
const limit = 12

const { getIntegralRecord, getIntegralWhere, getMemberInfo } = useMemberManage()
const { integralRecord, filterIntegralListToArray, integralRecordTotal, memberInfo, searchIntegralPage } = storeToRefs(useMemberManage())

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
  const params = {
    page: searchIntegralPage.value,
    limit,
    where: {
      member_id: route.query.id as string,
      ...where,
    },
  } as ReqList<IntegralRecord>

  await getIntegralRecord(params)
}

const openFilter = () => {
  isFilter.value = true
}

await getIntegral()
await getIntegralWhere()

// 筛选列表
async function submitWhere(f: Partial<IntegralRecord>) {
  filterData.value = { ...f }
  integralRecord.value = []
  await getIntegral(filterData.value)
}

const updatePage = async (page: number) => {
  searchIntegralPage.value = page
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
        <common-page v-model:page="searchIntegralPage" :total="integralRecordTotal" :limit="12" @update:page="updatePage" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
