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
  showInput: true,
})
const emits = defineEmits<{
  search: [e: string]
  clear: []
  filter: []
  clearSearch: []
  changeCard: []
}>()
const showtype = defineModel<'table' | 'list'>('showtype')
const search = (e: string) => {
  emits('search', e)
}
const filter = () => {
  emits('filter')
}
const clearSearch = () => {
  emits('clearSearch')
}
const searchKey = defineModel<string>('searchKey', { required: false, default: '' })
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
              <product-filter-search v-model:search-key="searchKey" :placeholder="placeholder" @submit="search" @clear="clearSearch" />
            </div>
          </template>
        </div>
        <common-tool-list v-model:showtype="showtype" :total="props.productListTotal" @height="filter" @change-card="emits('changeCard')" />
      </div>
    </common-layout-center>
  </div>
</template>
