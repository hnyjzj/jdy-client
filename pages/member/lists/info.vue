<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const route = useRoute()
const { useWxWork } = useWxworkStore()

const { getMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const memberParams = ref<Member>({} as Member)

// 上下文环境
const getContext = ref<any>()
// 外部用户id
const externalUserId = ref()

// id路由参数
const params = ref<any>()

const judgeContext = async () => {
  try {
    const wx = await useWxWork()
    if (!wx) {
      console.error('wx对象未正确获取')
      return
    }

    // 检查相关API是否可用
    await wx.checkJsApi()

    // 获取上下文
    const res = await wx.getContext()
    getContext.value = res

    if (res === 'single_chat_tools') {
      const userId = await wx?.getUserId()
      externalUserId.value = userId
      return userId
    }
  }
  catch (error) {
    console.error('调用wx.getContext失败', error)
  }
}

async function getInfo() {
  if (route.query.id) {
    // 如果来源有id，则直接从接口获取会员信息并展示
    const id = route.query.id ?? route.query.external_user_id
    await getMemberInfo({ id: id as string })
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
  else if (getContext.value === 'single_chat_tools') {
    // 如果来源没有id、且上下文环境为single_chat_tools
    params.value = externalUserId.value
    await getMemberInfo({ external_user_id: params.value })
    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await judgeContext()
await getInfo()

const relyOnId = () => {
  if (route.query.id) {
    // 普通调用时，跳转参数为id
    jump('/member/lists/new', { id: route.query.id })
  }
  else if (getContext.value === 'single_chat_tools') {
    // 单聊工具调用时，跳转参数为external_user_id
    jump('/member/lists/new', { external_user_id: externalUserId.value })
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
