<script setup lang="ts">
const { getProductInfo, getProductWhere, damageProduct } = useProductManage()
const { productInfo, filterList, filterListToArray } = storeToRefs(useProductManage())

const { $toast } = useNuxtApp()
// 成品列表详情
useSeoMeta({
  title: '列表详情',
})

const route = useRoute()
const isModel = ref(false)
// 报损原因
const reason = ref('')
if (route.query.code) {
  await getProductInfo(route.query.code as string)
}
await getProductWhere()

function goLoss() {
  isModel.value = true
}
// 报损
async function loss() {
  if (!reason.value) {
    $toast.error('请输入报损原因')
    return
  }
  const res = await damageProduct({ code: productInfo.value.code, reason: reason.value })
  if (res.code === HttpCode.SUCCESS) {
    isModel.value = false
    reason.value = ''
    getProductInfo(productInfo.value.code)
    $toast.success('报损成功')
  }
  else {
    $toast.error(res.message ?? '报损失败')
  }
}
</script>

<template>
  <div class="py-6">
    <product-finished-list :product-info="productInfo" :filter-list="filterList" :filter-list-to-array="filterListToArray" @go-loss="goLoss" />
    <div class="bottom">
      <div class="">
        <div class="flex-center-row grid-12 gap-4 px-4 py-2 col-12" uno-lg="col-8 offset-2" uno-md="col-12 flex-shrink-1">
          <div class="flex-1">
            <common-button-rounded content="操作记录" color="#fff" bgc="#FFF" />
          </div>
          <div class="flex-1">
            <common-button-rounded content="报损" color="#fff" bgc="#FFF" @button-click="goLoss" />
          </div>
          <div class="flex-1">
            <common-button-rounded content="编辑" @button-click="jump('/product/manage/edit', { code: productInfo.code })" />
          </div>
        </div>
      </div>
    </div>
    <common-model v-model="isModel" title="报损" :show-ok="true" @confirm="loss">
      <div>
        <div class="title">
          数量
        </div>
        <div class="block w-[96px]">
          {{ productInfo.num_gem }}
        </div>
      </div>
      <div class="my-4">
        <div class="title">
          条码
        </div>
        <div class="block flex justify-between items-center">
          <div>
            {{ productInfo.code }}
          </div>
          <div>
            <van-icon name="arrow" color="#808089" />
          </div>
        </div>
      </div>
      <div class="mb-4">
        <div class="title">
          原因
        </div>
        <textarea v-model="reason" resize="none" class="area" rows="4" cols="36" name="" />
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.title {
  --uno: 'text-color mb-2';
}
.block {
  --uno: 'text-14px px-3 py-10px rounded-[36px] color-[#333] bg-[#EFF0F6] dark:color-[#fff] border-[rgba(230,230,232,0.5)] border-1px border-solid dark:bg-[rgba(230,230,232,0.3)] dark:border-[rgba(230,230,232,0.3)]';
}
.area {
  --uno: 'bg-[#EFF0F6] dark:bg-[rgba(230,230,232,0.3)] border-none p-2 rounded-2';
}

.bottom {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc';
}
</style>
