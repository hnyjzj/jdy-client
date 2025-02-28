<script setup lang="ts">
// 搜索商品页
useSeoMeta({
  title: '商品列表',
})
const hasCheck = ref(true)
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[24px] col-12 pt-[24px]" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- hearder -->
      <div class="search-header flex flex-row gap-[12px] px-[16px]">
        <product-filter-search class="flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- content -->
      <div class="flex flex-row gap-[4px] items-center color-[#fff] font-size-[14px] px-[16px]">
        <span>搜索结果共</span>
        <span>1312321432535</span>
      </div>
      <!-- card -->
      <div class="flex flex-col gap-[16px] px-[16px]">
        <!-- 成品 -->
        <sale-order-product v-model="hasCheck" />
      </div>
      <!-- 操作栏 -->
      <common-button-bottom confirm-text="确认" cancel-text="取消" />
    </div>
  </div>
</template>
