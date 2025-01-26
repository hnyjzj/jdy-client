<script setup lang="ts">
useSeoMeta({
  title: '积分记录',
})

const route = useRoute()
const limit = 10

const { getMemberIntegral } = useMemberManage()
const { memberIntegral } = storeToRefs(useMemberManage())

const memberIntegralParams = ref<MemberIntegral[]>({} as MemberIntegral[])

const req = { page: 1, limit, id: route.query.id as string }

async function getIntegral() {
  if (route.query.id) {
    await getMemberIntegral(req)

    memberIntegralParams.value = JSON.parse(JSON.stringify(memberIntegral.value))
  }
}

await getIntegral()
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[20px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>

      <member-integral-record :data="memberIntegralParams" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
