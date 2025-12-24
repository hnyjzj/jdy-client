<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'

const props = defineProps<{
  stockCategoryDate: any
  title: string
  loading: boolean
}>()

// 图表 / 列表切换
const chartMode = ref<'list' | 'chart'>('list')

// 饼图维度（件数 / 金重 / 标价）
const chartBar = ref<string>('件数')

// 饼图配置
const option = ref<any>({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    itemGap: 12,
    textStyle: { color: '#808089', fontSize: 12 },
    type: 'scroll',
    pageColor: 'red',
    pageIconColor: '#999',
    pageIconSize: 12,
    pageTextStyle: {
      color: '808089', // 页码颜色
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{d}%',
        fontSize: 12,
      },
      labelLine: { show: true, length: 12, length2: 8 },
    },
  ],
})

// 更新饼图数据
function updateChart() {
  if (!props.stockCategoryDate)
    return

  const dataObj = props.stockCategoryDate[chartBar.value]
  if (!dataObj)
    return

  option.value.series[0].data = Object.entries(dataObj).map(([name, value]) => ({
    name,
    value: Number(value),
  }))
}

// 生成表格列
const columns = computed<DataTableColumns>(() => {
  const row = Object.keys(props.stockCategoryDate || {})
  return [
    { title: '分类', key: '分类', fixed: 'left', width: 120 },
    ...row.map(item => ({ title: item, key: item, width: 100 })),
  ]
})

// 生成表格数据
const data = computed(() => {
  if (!props.stockCategoryDate)
    return []

  const keys = Object.keys(props.stockCategoryDate)
  const categories = Array.from(
    new Set(keys.flatMap(key => Object.keys(props.stockCategoryDate[key] || {}))),
  )

  return categories.map((category) => {
    const row: Record<string, any> = { 分类: category }
    keys.forEach((val) => {
      row[val] = props.stockCategoryDate[val]?.[category] ?? 0
    })
    return row
  })
})

// 监听数据和维度变化更新图表
watch([() => props.stockCategoryDate, chartBar, chartMode], updateChart)

const { $colorMode } = useNuxtApp()
const tdColor = computed(() => {
  return $colorMode.value === 'light' ? '#1A6DD8' : '#fff'
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#CBCDD1" size="large">
    <div
      class="mt-[16px] overflow-hidden bg"
      :style="{
        background: $colorMode.value === 'dark' ? '#1D2C60' : 'linear-gradient(180deg, #daeaff 0%, #ffffff 30.77%, #ffffff 71.15%)',
      }">
      <div class="w-[100%] flex justify-between items-center pb-[16px]">
        <div class="flex items-center gap-[6px] color-[#1A6DD8] font-semibold line-height-[24px] text-[16px]">
          <img src="/images/icon/today-sale.png" class="wh-[24px]">
          <span>{{ props.title }}</span>
        </div>
        <div>
          <summary-Toggle v-model="chartMode" />
        </div>
      </div>

      <!-- 图表模式 -->
      <template v-if="chartMode === 'chart'">
        <!-- 饼图维度切换 -->
        <div class="flex justify-center gap-2 my-4 flex-wrap">
          <template v-for="(key, idx) in Object.keys(props.stockCategoryDate || {})" :key="idx">
            <div
              class="px-4 py-1 text-sm rounded-full cursor-pointer"
              :class="chartBar === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'"
              @click="chartBar = key"
            >
              {{ key }}
            </div>
          </template>
        </div>

        <!-- 饼图容器 -->
        <div class="chart-wrapper p-2">
          <ClientOnly fallback-tag="div" fallback="加载中...">
            <VChart class="chart" :option="option" autoresize />
          </ClientOnly>
        </div>
      </template>

      <!-- 列表模式 -->
      <template v-else>
        <n-data-table
          :style="{
            '--n-merged-td-color': $colorMode.value === 'light' ? '#fff' : '#1D2C60',
            '--n-merged-td-text-color': $colorMode.value === 'light' ? '#1A6DD8' : '#fff',
            '--n-merged-td-color-hover': $colorMode.value === 'light' ? '#DAEAFF' : '#0050B8',
            '--n-merged-th-color': $colorMode.value === 'light' ? '#F3F3F3' : '#0F1E52',
            '--n-merged-border-color': 'rgba(57,113,243,0.0)',
            '--td-color': tdColor,
          }"
          :max-height="350"
          :columns="columns"
          :data="data"
          bordered
        />
      </template>
    </div>
  </n-spin>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}
.chart {
  width: 100%;
  height: 300px;
}
.bg {
  background: linear-gradient(180deg, #daeaff 0%, #ffffff 30.77%, #ffffff 71.15%);
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
