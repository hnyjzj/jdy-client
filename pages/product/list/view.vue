<script setup lang="ts">
const { getFinishedRetrieval, getFinishedWhere } = useFinished()
const { finishedInfo, finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

const { $toast } = useNuxtApp()
const { useWxWork } = useWxworkStore()
const route = useRoute()

// 成品列表详情
useSeoMeta({
  title: '成品检索',
})
const statusCode = ref()
const liveCode = ref()
await getFinishedWhere()

async function getInfo(code: string) {
  if (!Object.keys(myStore.value).length) {
    return $toast.error('请先选择门店')
  }

  const data = await getFinishedRetrieval(code, myStore.value.id)
  if (data?.code !== 200) {
    $toast.error(data?.message || '获取成品信息失败')
    statusCode.value = data?.code || 500
    return
  }
  statusCode.value = 200
}
const listJump = () => {
  const url = UrlAndParams(route.path, { code: liveCode.value })
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
/** 扫码 */
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    liveCode.value = code
    listJump()
  }
}

/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const code = route.query?.code
  if (code) {
    liveCode.value = code
    await getInfo(liveCode.value)
  }
}

async function searchFun(code: string) {
  if (!code)
    return $toast.error('请正确输入条码')
  liveCode.value = code
  listJump()
}

onMounted(async () => {
  await getMyStore()
  await handleQueryParams()
})
</script>

<template>
  <div>
    <div class="blur-bgc">
      <common-layout-center>
        <div class=" pr-4 flex justify-between">
          <product-manage-company />
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="flex px-4">
        <div class="flex-1 sm:px-4">
          <product-filter-search v-model:search-key="liveCode" placeholder="搜索条码" @submit="searchFun" />
        </div>
        <div
          class="flex items-center justify-end cursor-pointer"
          @click="scanCode()">
          <icon class="ml-2 text-[#1A6DD8]" name="i-icon:scanit" :size="24" />
        </div>
      </div>
      <div class="p-4">
        <template v-if="finishedInfo && statusCode === 200">
          <product-manage-info :info="finishedInfo" :filter-list="finishedFilterList" :filter-list-to-array="finishedFilterListToArray" />
        </template>
        <template v-else>
          <common-empty text="暂无数据" />
        </template>
      </div>
    </common-layout-center>
  </div>
</template>
