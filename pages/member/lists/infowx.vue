<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})
// 企业微信、单聊入口所需页面

const { useWxWork, getTickets } = useWxworkStore()
const { wx } = storeToRefs(useWxworkStore())
const { getMemberInfo, getMemberConsume, getMemberWhere } = useMemberManage()
const { memberInfo, memberConsume, filterList } = storeToRefs(useMemberManage())

type MemberParams = Pick<Member, 'id' | 'external_user_id'>
const memberParams = ref<MemberParams>({ external_user_id: '' } as MemberParams)

const route = useRoute()
const show = ref(false)
const targetId = ref('')

if (route.query?.external_user_id) {
  const external_user_id = route.query.external_user_id as string
  memberParams.value.external_user_id = external_user_id
}
const { $toast } = useNuxtApp()
const getInfo = async () => {
  memberInfo.value = {} as Member
  const res = await getMemberInfo(memberParams.value)
  if (res?.id) {
    await getMemberConsume({ id: memberInfo.value.id })
  }
  else {
    $toast.error('获取用户信息失败')
  }
}

getTickets({ platform: 'wxwork' })
getMemberWhere()

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
    else {
      $toast.error('获取用户信息失败')
    }
  }
})

const relyOnId = () => {
  if (memberParams.value.external_user_id) {
    // 单聊工具调用时，跳转参数为external_user_id
    jump('/member/lists/editwx', { external_user_id: memberParams.value.external_user_id })
  }
}

const exhibition = (id: string) => {
  targetId.value = id
  show.value = true
}
</script>

<template>
  <div>
    <n-modal v-model:show="show" title="订单详情" preset="card" draggable :style="{ width: '100%', height: '90vh' }">
      <iframe width="100%" height="100%" :src="`/sale/sales/order?id=${targetId}&&embedded=true`" />
    </n-modal>
    <template v-if="memberInfo.id">
      <member-lists-info-wx
        :data="memberInfo" :consumes="memberConsume" :filter-list="filterList"
        @go-edit="relyOnId" @show-detail="exhibition" />
    </template>
    <template v-else>
      <common-emptys text="查询用户中" />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
