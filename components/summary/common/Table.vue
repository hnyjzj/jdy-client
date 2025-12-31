<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'

const props = defineProps<{
  title: DataTableColumns
  list?: { [key: string]: string }[]
}>()
const scrollX = ref(0)

for (let i = 0; i < props.title.length; ++i) {
  scrollX.value += 100
}
const { isDark } = storeToRefs(useThemeStore())
const tdColor = computed(() => {
  return isDark.value ? '#fff' : '#1A6DD8'
})
</script>

<template>
  <div>
    <n-data-table
      :style="{
        '--n-merged-td-color': isDark ? '#1D2C60' : '#fff',
        '--n-merged-td-text-color': isDark ? '#fff' : '#1A6DD8',
        '--n-merged-td-color-hover': isDark ? '#0050B8' : '#DAEAFF',
        '--n-merged-th-color': isDark ? '#0F1E52' : '#F3F3F3',
        '--n-merged-border-color': 'rgba(57,113,243,0.0)',
        '--td-color': tdColor,
      }"
      :columns="props.title"
      :data="props.list"
      :scroll-x="scrollX"
      :max-height="350"
      :bordered="true"
      :render-cell="(value: any) => {
        if (!value){
          return 0
        }
        return value
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-data-table .n-data-table-base-table-header) {
  border-radius: 8px;
}
:deep(.n-data-table-tr:hover .n-data-table-td) {
  color: var(--td-color);
}
</style>
