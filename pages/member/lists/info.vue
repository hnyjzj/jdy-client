<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const { getMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

type MemberParams = Pick<Member, 'id' | 'external_user_id'>
const memberParams = ref<MemberParams>({} as MemberParams)

const route = useRoute()
if (route.query?.id) {
  const id = route.query.id as string
  memberParams.value.id = id
}

async function getInfo() {
  await getMemberInfo(memberParams.value)
}

await getInfo()

const relyOnId = () => {
  if (memberParams.value.id) {
    jump('/member/lists/edit', { id: memberParams.value.id })
  }
}
</script>

<template>
  <div>
    <member-lists-info :data="memberInfo" @go-edit="relyOnId" />
  </div>
</template>

<style scoped lang="scss">
</style>
