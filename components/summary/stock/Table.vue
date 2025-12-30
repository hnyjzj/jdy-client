<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'

const props = defineProps<{
  date: Record<string, any>
  title: string
  loading: boolean
  classify: string
}>()

const scrollX = ref(0)

const metricsLength = computed(() => {
  const firstPerson = Object.keys(props.date || {})[0]
  return firstPerson ? Object.keys(props.date[firstPerson]).length : 0
})

scrollX.value = metricsLength.value * 120 + 120

// 所有分类（从 props.date 的每个日期里收集）
const categories = computed<string[]>(() => {
  const keys = Object.keys(props.date || {})
  return Array.from(
    new Set(keys.flatMap(k => Object.keys(props.date[k] || {}))),
  )
})

// columns：第一列为日期，后面是分类列
const columns = computed<DataTableColumns<Record<string, any>>>(() => [
  { title: props.classify, key: props.classify, fixed: 'left', width: 120 },
  ...categories.value.map(c => ({ title: c, key: c, width: 120 })),
])

// data：每一行是一个日期，使用 categories 来填充对应列（不会触碰 columns 对象）
const data = computed(() => {
  if (!props.date)
    return []

  return Object.entries(props.date).map(([date, val]) => {
    const row: Record<string, any> = { [props.classify]: date }
    categories.value.forEach((c) => {
      row[c] = val?.[c] ?? 0
    })
    return row
  })
})

const colorMode = useColorMode()
const tdColor = computed(() => {
  return colorMode.value === 'light' ? '#1A6DD8' : '#fff'
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#CBCDD1" size="large">
    <div
      class="my-[16px] overflow-hidden bg"
      uno-bg="[linear-gradient(180deg,_#daeaff_0%,_#ffffff_30.77%,_#ffffff_71.15%)]"
      uno-dark:bg="[linear-gradient(0deg,_#1D2C60,_#1D2C60)]"
    >
      <div class="w-[100%] flex justify-between items-center pb-[16px]">
        <div class="flex items-center gap-[6px] color-[#1A6DD8] font-semibold line-height-[24px] text-[16px]">
          <img src="/images/icon/today-sale.png" class="wh-[24px]">
          <span>{{ props.title }}</span>
        </div>
      </div>
      <n-data-table
        :style="{
          '--n-merged-td-color': colorMode.value === 'light' ? '#fff' : '#1D2C60',
          '--n-merged-td-text-color': colorMode.value === 'light' ? '#1A6DD8' : '#fff',
          '--n-merged-td-color-hover': colorMode.value === 'light' ? '#DAEAFF' : '#0050B8',
          '--n-merged-th-color': colorMode.value === 'light' ? '#F3F3F3' : '#0F1E52',
          '--n-merged-border-color': 'rgba(57,113,243,0.0)',
          '--td-color': tdColor,
        }"
        :columns="columns"
        :data="data"
        :scroll-x="scrollX"
        :max-height="350"
        bordered
      />
    </div>
  </n-spin>
</template>

<style lang="scss" scoped>
.bg {
  box-shadow: 0px 5px 20px 0px #0000000a;
  padding: 12px 16px;
  border-radius: 8px;
}

:deep(.n-data-table .n-data-table-base-table-header) {
  border-radius: 8px;
}
:deep(.n-data-table-tr:hover .n-data-table-td) {
  color: var(--td-color);
}
</style>
