<script setup lang="ts">
// const { $toast } = useNuxtApp()

useSeoMeta({
  title: '会员检索',
})
const { getMemberList } = useMemberManage()
const { memberList, memberConsume } = storeToRefs(useMemberManage())
// const { myStore } = storeToRefs(useStores())
async function getList(where = {} as Partial<Member>) {
  const params = { page: 1, limit: 1, where: { } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getMemberList(params)
}
const show = ref(false)
const targetId = ref('')
type MemberParams = Pick<Member, 'id' | 'external_user_id'>
const memberParams = ref<MemberParams>({} as MemberParams)
getList({ phone: '15038218863' })
const getInfo = async (val: string) => {
  getList({ phone: val })
//   await getMemberConsume({ id: memberParams.value.id })
}
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
    <common-layout-center>
      <div class="p-4">
        <div class="color-[#fff] py-[12px] flex justify-between">
          <product-manage-company />
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search placeholder="搜索会员手机号" @submit="getInfo" />
          </div>
        </div>

        <div>
          <template v-if="memberList.length !== 0">
            <member-lists-info :data="memberList[0]" :consumes="memberConsume" @go-edit="relyOnId" @show-detail="exhibition" />
          </template>
        </div>
      </div>
    </common-layout-center>
  </div>
</template>
