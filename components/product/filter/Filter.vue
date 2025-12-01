<script setup lang="ts">
/** 顶部筛选区域 */
const props = withDefaults(defineProps<{
  productListTotal?: number
  placeholder?: string
  /** 是否显示切换组件 */
  showCompany?: boolean
  /** 是否显示输入搜索框 */
  showInput?: boolean
  isExport?: boolean
}>(), {
  showCompany: true,
  showInput: true,
  isExport: false,
})
const emits = defineEmits<{
  search: [e: string]
  clear: []
  filter: []
  clearSearch: []
  changeCard: []
  export: []
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
  <div class="blur-bgc text-color sticky top-0 z-9">
    <common-layout-center>
      <div class="flex flex-row gap-2">
        <template v-if="showCompany">
          <slot name="company" />
        </template>
      </div>
      <div class="flex flex-col px-[16px] w-full">
        <template v-if="showInput">
          <div class="grid-12">
            <div class="col-12" uno-sm="col-8 offset-2">
              <product-filter-search v-model:search-key="searchKey" :placeholder="placeholder" @submit="search" @clear="clearSearch" />
            </div>
          </div>
        </template>
        <common-tool-list v-model:showtype="showtype" :is-export="isExport" :total="props.productListTotal" @export="emits('export')" @height="filter" @change-card="emits('changeCard')" />
      </div>
    </common-layout-center>
  </div>
</template>
