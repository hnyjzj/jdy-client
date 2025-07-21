<script setup lang="ts">
const props = defineProps<{
  columns: any[]
  list: any[]
  pageOption: any
}>()
</script>

<template>
  <div>
    <n-data-table
      :style="{
        '--n-item-text-color-active': '#4678B9',
        '--n-item-border-active': '1px solid #2976EF',
        '--n-item-text-color-hover': '#333',
      }"
      size="large"
      remote
      :bordered="false"
      :single-line="false"
      :columns="props.columns"
      :data="props.list"
      :pagination="props.pageOption"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active) {
  border: 1px solid #2976ef !important;
  color: #2976ef !important;
}
</style>
