<script setup lang="ts">
useSeoMeta({
  title: '会员检索',
})
const { getMemberList, getMemberConsume } = useMemberManage()
const { memberList, memberConsume } = storeToRefs(useMemberManage())

async function getList(where = {} as Partial<Member>) {
  const params = { page: 1, limit: 1, where: { } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getMemberList(params)
}

const getInfo = async (val: string) => {
  await getList({ phone: val })
  if (memberList.value.length) {
    await getMemberConsume({ id: memberList.value[0].id })
  }
}
const clearFn = () => {
  memberList.value = []
  memberConsume.value = []
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-4">
        <div class="color-[#fff] py-[12px] flex justify-between">
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search placeholder="搜索会员手机号进行检索" @submit="getInfo" @clear="clearFn" />
          </div>
        </div>

        <div>
          <template v-if="memberList.length !== 0">
            <member-lists-info :data="memberList[0]" :consumes="memberConsume" :showbottom="false" :show-detail="false" />
          </template>
          <template v-else>
            <common-emptys />
          </template>
        </div>
      </div>
    </common-layout-center>
  </div>
</template>
