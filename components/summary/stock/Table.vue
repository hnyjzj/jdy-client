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
</script>

<template>
  <n-spin :show="props.loading" stroke="#fff" size="large">
    <div class="my-[16px] overflow-hidden">
      <common-fold :is-collapse="false" from-color="rgba(71,126,245,0.6)" to-color="rgba(243,245,254,0.6)">
        <template #title>
          <div class="w-[100%] flex justify-between items-center">
            <div class="text-[14px]">
              {{ props.title }}
            </div>
          </div>
        </template>
        <n-data-table
          :style="{
            '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : 'rgba(71, 126, 245, 0.6)',
            '--n-merged-td-color': $colorMode.value === 'light' ? '#DEEBFD' : '#224879',
            '--n-merged-border-color': 'rgba(57,113,243,0.08)',
          }"
          :columns="columns"
          :data="data"
          :scroll-x="scrollX"
          :max-height="350"
          bordered
        />
      </common-fold>
    </div>
  </n-spin>
</template>
