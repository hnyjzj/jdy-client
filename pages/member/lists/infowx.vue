<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})
// 企业微信、单聊入口所需页面

const { useWxWork, getTickets } = useWxworkStore()
const { wx } = storeToRefs(useWxworkStore())
const { getMemberInfo, getMemberConsume } = useMemberManage()
const { memberInfo, memberConsume } = storeToRefs(useMemberManage())

type MemberParams = Pick<Member, 'id' | 'external_user_id'>
const memberParams = ref<MemberParams>({} as MemberParams)

const route = useRoute()
const show = ref(false)
const targetId = ref('')

if (route.query?.external_user_id) {
  const external_user_id = route.query.external_user_id as string
  memberParams.value.external_user_id = external_user_id
}

async function getInfo() {
  await getMemberInfo(memberParams.value)
  if (memberInfo.value.id) {
    await getMemberConsume({ id: memberInfo.value.id })
  }
}

await getInfo()
await getTickets({ platform: 'wxwork' })

onMounted(async () => {
  if (wx?.value) {
    await useWxWork()
  }
  if (!wx.value?.getContext) {
    return
  }
  const res = await wx.value?.getContext()
  if (res?.entry && !memberParams.value.external_user_id) {
    const userid = await wx.value.getUserId()
    if (userid) {
      memberParams.value.external_user_id = userid
      await getInfo()
    }
  }
})

const relyOnId = () => {
  if (memberParams.value.external_user_id) {
    // 单聊工具调用时，跳转参数为external_user_id
    jump('/member/lists/edit', { external_user_id: memberParams.value.external_user_id })
  }
}

const exhibition = (id: string) => {
  targetId.value = id
  show.value = true
}
</script>

<template>
  <div>
    <n-modal v-model:show="show">
      <n-card
        style="width: 600px;height: 60vh;"
        title="订单详情"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <iframe
          width="100%"
          height="100%"
          :src="`/sale/sales/order?id=${targetId}&&embedded=true`"
        />
      </n-card>
    </n-modal>
    <member-lists-info-wx :data="memberInfo" :consumes="memberConsume" @go-edit="relyOnId" @show-detail="exhibition" />
  </div>
</template>

<style scoped lang="scss">
</style>
