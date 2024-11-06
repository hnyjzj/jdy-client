<script setup lang="ts">
useSeoMeta({
  title: '业绩汇总',
})
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- 切换门店 筛选门店 -->
      <div class="flex justify-between">
        <product-manage-company class="color-[#fff]" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <finance-achievement-summary />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
