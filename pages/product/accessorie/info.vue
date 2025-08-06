<script setup lang="ts">
const { getAccessorieInfo, getAccessorieWhere } = useAccessorie()
const { accessorieInfo, accessorieFilterListToArray, accessorieFilterList } = storeToRefs(useAccessorie())

// const { $toast } = useNuxtApp()
// 成品列表详情
useSeoMeta({
  title: '详情',
})

const route = useRoute()
const isModel = ref(false)
if (route.query.id) {
  await getAccessorieInfo(route.query.id as string)
  await getAccessorieWhere()
}

function goLoss() {
  isModel.value = true
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-6 pb-18 px-4">
        <product-manage-info :product-type="GoodsType.ProductAccessories" :store="accessorieInfo?.store?.name" :info="accessorieInfo" :filter-list="accessorieFilterList" :filter-list-to-array="accessorieFilterListToArray" @go-loss="goLoss" />
      </div>
    </common-layout-center>
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
