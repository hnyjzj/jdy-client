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
</script>

<template>
  <div>
    <member-lists-info :data="memberInfo" />
  </div>
</template>

<style scoped lang="scss">
</style>
