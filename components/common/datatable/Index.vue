<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns: any[]
  list: any[]
  pageOption: any
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
  <div class="grid-12">
    <div class="flex flex-col col-12 p-[16px]" uno-lg="col-8 offset-2" uno-sm="col-12">
      <n-data-table
        :loading="props.loading"
        striped
        :style="{
          '--n-item-text-color-active': '#4678B9',
          '--n-item-border-active': '1px solid #2976EF',
          '--n-item-text-color-hover': '#333',
          '--n-loading-color': 'orange',
        }"
        size="large"
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
:deep(.n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active) {
  border: 1px solid #2976ef !important;
  color: #2976ef !important;
}
</style>
