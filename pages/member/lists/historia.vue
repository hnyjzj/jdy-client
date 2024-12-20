<script setup lang="ts">
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[20px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>

      <member-lists-historia />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
