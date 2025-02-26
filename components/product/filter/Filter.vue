<script setup lang="ts">
const props = defineProps({
  productListTotal: Number,
})
const emits = defineEmits(['filter'])
const search = defineModel<string>('search', { default: '' })
const filter = () => {
  emits('filter')
}
</script>

<template>
  <div class="sticky top-0 bg-[#3875C5] z-1">
    <div class="grid-12 py-[12px] px-[16px] color-[#Fff]">
      <div class="col-12 grid-12 lg:col-8 lg:offset-2">
        <div class="col-4">
          <slot name="company" />
        </div>
        <div class="col-8 offset-4 ml-4">
          <product-filter-search v-model:search-key="search" />
        </div>
      </div>
      <div class="col-12 grid-12 lg:col-8 lg:offset-2 pt-[12px] pb-[16px]">
        <div class="col-8 py-[6px] px-[12px] line-height-[20px]">
          共 {{ props.productListTotal }} 条数据
        </div>
        <div class="col-4 ">
          <product-filter-Senior @filter="filter" />
        </div>
      </div>
    </div>
  </div>
</template>
