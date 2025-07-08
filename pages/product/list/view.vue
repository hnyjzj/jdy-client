<script setup lang="ts">
const { getFinishedRetrieval, getFinishedWhere } = useFinished()
const { finishedInfo, finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())

const { $toast } = useNuxtApp()
const { useWxWork } = useWxworkStore()

const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: '成品检索',
})
const statusCode = ref()
productName.value = finishedInfo.value.name
await getFinishedWhere()

async function getInfo(code: string) {
  const data = await getFinishedRetrieval(code)
  if (data?.code !== 200) {
    $toast.error(data?.message || '获取成品信息失败')
    return
  }
  statusCode.value = 200
}
/** 扫码 */
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    getInfo(code)
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-4">
        <div class="color-[#fff] py-[12px] flex justify-between">
          <product-manage-company />
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search placeholder="搜索条码" @submit="getInfo" />
          </div>
          <div
            class="flex items-center justify-end cursor-pointer"
            @click="scanCode()">
            <icon class="ml-2" name="i-icon:scanit" :size="18" />
          </div>
        </div>

        <template v-if="finishedInfo && statusCode === 200">
          <product-manage-info :info="finishedInfo" :filter-list="finishedFilterList" :filter-list-to-array="finishedFilterListToArray" />
        </template>
      </div>
    </common-layout-center>
  </div>
</template>
