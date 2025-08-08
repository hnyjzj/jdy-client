<script setup lang="ts">
useSeoMeta({
  title: '会员检索',
})
const { getMemberList, getMemberConsume } = useMemberManage()
const { memberList, memberConsume } = storeToRefs(useMemberManage())
const route = useRoute()
const livePhone = ref()
const { $toast } = useNuxtApp()

async function getInfo() {
  await getMemberList({ page: 1, limit: 20, where: { phone: livePhone.value } })
  if (memberList.value.length) {
    await getMemberConsume({ id: memberList.value[0].id })
  }
}

const clearFn = () => {
  memberList.value = []
  memberConsume.value = []
}

const listJump = () => {
  const url = UrlAndParams(route.path, { phone: livePhone.value })
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const phone = route.query?.phone
  if (phone) {
    livePhone.value = phone
    await getInfo()
  }
}

async function searchFun(phone: string) {
  if (!phone)
    return $toast.error('请输入手机号')
  livePhone.value = phone
  listJump()
}

onMounted(async () => {
  // 确保页面状态稳定，再开始处理
  await nextTick()
  await handleQueryParams()
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-4">
        <div class="color-[#fff] py-[12px] flex justify-between">
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search v-model:search-key="livePhone" placeholder="搜索会员手机号进行检索" @submit="searchFun" @clear="clearFn" />
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
