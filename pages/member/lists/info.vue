<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const route = useRoute()
const limit = 10

const { getMemberInfo, getMemberIntegral } = useMemberManage()
const { memberInfo, memberIntegral } = storeToRefs(useMemberManage())

const memberParams = ref<Member>({} as Member)
const memberIntegralParams = ref<MemberIntegral>({} as MemberIntegral)

const req = { page: 1, limit, id: route.query.id as string }

async function getInfo() {
  if (route.query.id) {
    await getMemberInfo(route.query.id as string)
    await getMemberIntegral(req)

    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
    memberIntegralParams.value = JSON.parse(JSON.stringify(memberIntegral.value))
  }
}

await getInfo()

const goEdit = (id: string) => {
  jump('/member/lists/new', { id })
}
</script>

<template>
  <div>
    <member-lists-info :data="memberInfo" :integral="memberIntegral" @go-edit="goEdit(memberParams.id)" />
  </div>
</template>

<style scoped lang="scss">
</style>
