<script setup lang="ts">
/** 顶部筛选区域 */
const props = withDefaults(defineProps<{
  productListTotal?: number
  placeholder?: string
  /** 是否显示切换组件 */
  showCompany?: boolean
  /** 是否显示输入搜索框 */
  showInput?: boolean
}>(), {
  showCompany: true,
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
  <div class="bg-[#3875c5] sticky top-0 z-1">
    <common-layout-center>
      <div class="flex flex-col pt-5 px-[16px] w-full color-[#fff]">
        <div class="flex flex-row gap-2">
          <template v-if="showCompany">
            <slot name="company" />
          </template>
          <template v-if="showInput">
            <div class="flex-1">
              <product-filter-search :placeholder="placeholder" @submit="search" @clear="clearSearch" />
            </div>
          </template>
        </div>
        <div class="flex-center-between py-4">
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
