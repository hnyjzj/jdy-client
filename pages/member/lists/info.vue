<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const route = useRoute()

const { getMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const memberParams = ref<Member>({} as Member)

async function getInfo() {
  if (route.query.id) {
    await getMemberInfo(route.query.id as string)

    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await getInfo()

const goEdit = (id: string) => {
  jump('/member/lists/new', { id })
}
</script>

<template>
  <div>
    <member-lists-info :data="memberInfo" @go-edit="goEdit(memberParams.id)" />
  </div>
</template>

<style scoped lang="scss">
</style>
