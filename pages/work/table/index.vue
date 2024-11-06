<script setup lang="ts">
useSeoMeta({
  title: '工作台',
})
</script>

<template>
  <div>
    <div class="color-[#fff] grid-12 px-[16px] py-[12px]">
      <div class="col-4" uno-sm="col-3 offset-1" uno-lg="col-2 offset-2" uno-xl="col-1 offset-3">
        <product-manage-company />
      </div>
      <div class="col-7 offset-5" uno-sm="col-6 offset-5" uno-lg="col-5 offset-5" uno-xl="col-4 offset-5">
        <product-filter-search />
      </div>
    </div>

    <common-coll>
      <template #title="{ title }">
        <div>{{ title }}</div>
      </template>
      <template #content="{ content }">
        <div class="">
          <work-card-enter :content="content" />
        </div>
      </template>
    </common-coll>

    <common-tabbar text="table" />
  </div>
</template>
