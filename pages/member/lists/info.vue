<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

const { getMemberInfo, getMemberConsume } = useMemberManage()
const { memberInfo, memberConsume } = storeToRefs(useMemberManage())

type MemberParams = Pick<Member, 'id' | 'external_user_id'>
const memberParams = ref<MemberParams>({} as MemberParams)

const show = ref(false)
const targetId = ref('')

const route = useRoute()
if (route.query?.id) {
  const id = route.query.id as string
  memberParams.value.id = id
}

async function getInfo() {
  await getMemberInfo(memberParams.value)
  await getMemberConsume({ id: memberParams.value.id })
}

await getInfo()

const relyOnId = () => {
  if (memberParams.value.id) {
    jump('/member/lists/edit', { id: memberParams.value.id })
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
    <member-lists-info :data="memberInfo" :consumes="memberConsume" @go-edit="relyOnId" @show-detail="exhibition" />
  </div>
</template>

<style scoped lang="scss">
</style>
