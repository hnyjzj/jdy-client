<script setup lang="ts">
useSeoMeta({
  title: '业绩汇总',
})

const showPop = ref(false)

const handlePop = () => {
  showPop.value = true
}
</script>

<template>
  <div class="grid-12">
    <common-popup v-model="showPop" />
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="flex justify-between">
        <product-manage-company class="color-[#fff]" />
        <product-filter-senior class="color-[#fff]" @click="handlePop" />
      </div>
      <finance-achievement-summary />
    </div>
  </div>
</template>
