<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const route = useRoute()
const { useWxWork } = useWxworkStore()

const { getMemberInfo } = useMemberManage()
const { memberInfo } = storeToRefs(useMemberManage())

const memberParams = ref<Member>({} as Member)

async function getInfo() {
  const id = route.query.id ?? route.query.external_user_id
  if (id) {
    // 来源若有用户id，则从接口获取会员信息并展示
    await getMemberInfo({ id: id as string })

    memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
  }
}

await getInfo()

const judgeContext = async () => {
  try {
    const wx = await useWxWork()
    if (!wx) {
      console.error('wx对象未正确获取')
      return
    }

    // 检查相关API是否可用
    const checkResult = await wx.checkJsApi()
    console.log('API检查结果', checkResult)

    const res = await wx.getContext()
    console.log('entry调用', res)
    return res
  }
  catch (error) {
    console.error('调用wx.getContext失败', error)
  }
}

onMounted(async () => {
  await judgeContext()
})

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
