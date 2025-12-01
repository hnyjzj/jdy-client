<script setup lang="ts">
import type { PaginationProps } from 'naive-ui'

const props = withDefaults(defineProps<{
  columns: any[]
  list: any[]
  pageOption?: PaginationProps
  loading?: boolean
}>(), {
  loading: false,
})
let scrollX = 0
for (let i = 0; i < props.columns.length; ++i) {
  scrollX += 120
}
</script>

<template>
  <div class="font-[12px]">
    <div class="p-3 blur-bgc rounded-3">
      <n-data-table
        :loading="props.loading"
        :style="{
          '--n-item-text-color-active': '#4678B9',
          '--n-item-border-active': '1px solid #2976EF',
          '--n-item-text-color-hover': '#333',
          '--n-loading-color': 'orange',
        }"
        size="small"
        remote
        :bordered="false"
        :single-line="false"
        :columns="props.columns"
        :scroll-x="scrollX"
        :data="props.list"
        :pagination="props.pageOption"
        :max-height="600"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 移除所有边框
:deep(.n-data-table) {
  border: none !important;
}
:deep(.n-data-table-th) {
  border: none !important;
}
:deep(.n-data-table-td) {
  border: none !important;
}
</style>
