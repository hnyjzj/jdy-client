<script setup lang="ts">
const props = defineProps({
  productListTotal: Number,
  placeholder: String,
})
const emits = defineEmits<{
  search: [e: string]
  clear: []
  filter: []
  clearSearch: []
}>()
const search = (e: string) => {
  emits('search', e)
}
const filter = () => {
  emits('filter')
}
const clearSearch = () => {
  emits('clearSearch')
}
</script>

<template>
  <div class="top sticky top-0 z-1">
    <common-layout-center>
      <div class="flex flex-col py-[12px] px-[16px] w-full color-[#fff]">
        <div class="flex flex-row gap-2">
          <slot name="company" />
          <div class="flex-1">
            <product-filter-search :placeholder="placeholder" @submit="search" @clear="clearSearch" />
          </div>
        </div>
        <div class="flex-center-between gap-2 pt-[12px] pb-[16px]">
          <div class="py-[6px] px-[12px] line-height-[20px]">
            共 {{ props.productListTotal }} 条数据
          </div>
          <div class="col-4">
            <product-filter-Senior @filter="filter" />
          </div>
        </div>
      </div>
    </common-layout-center>
  </div>
</template>

<style>
.top {
  background: rgba(56, 117, 197, 0.8);
  backdrop-filter: blur(10px); /* 模糊背景 */
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari */
}
</style>
