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
  <div class="sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9] z-1">
    <div class="grid-12">
      <div class="col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-col py-[12px] px-[16px] w-full color-[#fff]">
          <div class="flex flex-row gap-2">
            <slot name="company" />
            <div class="flex-1">
              <product-filter-search v-model:search-key="search" />
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
      </div>
    </div>
  </div>
</template>
