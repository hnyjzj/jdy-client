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
const { isDark } = storeToRefs(useThemeStore())
const tdColor = computed(() => {
  return isDark ? '#fff' : '#1A6DD8'
})
</script>

<template>
  <div class="font-[12px]">
    <div class="p-3 blur-bgc rounded-3">
      <n-data-table
        :loading="props.loading"
        :style="{
          '--n-merged-td-color': isDark ? '#1D2C60' : '#fff',
          '--n-merged-td-text-color': isDark ? '#fff' : '#1A6DD8',
          '--n-merged-td-color-hover': isDark ? '#0050B8' : '#DAEAFF',
          '--n-merged-th-color': isDark ? '#0F1E52' : '#F3F3F3',
          '--n-merged-border-color': 'rgba(57,113,243,0.0)',
          '--td-color': tdColor,
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
:deep(.n-data-table .n-data-table-base-table-header) {
  border-radius: 8px;
}
:deep(.n-data-table-tr:hover .n-data-table-td) {
  color: var(--td-color);
}
</style>
