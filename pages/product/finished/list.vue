<script setup lang="ts">
const { getProductInfo, getProductWhere } = useProductManage()
const { productInfo, filterList } = storeToRefs(useProductManage())

// 成品列表详情
useSeoMeta({
  title: '列表详情',
})
const route = useRoute()
usePageShow(() => {
  getProductInfo(route.query.code as string)
  getProductWhere()
})
</script>

<template>
  <div class="py-6">
    <product-finished-list :product-list="productInfo" :filter-list="filterList" />
  </div>
</template>
