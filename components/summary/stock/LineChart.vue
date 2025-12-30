<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'

const props = defineProps<{
  date: Record<string, any>
  title: string
  loading: boolean
}>()
// 图表 / 列表切换
const chartMode = ref<'list' | 'chart'>('chart')

// 趋势维度（件数 / 销售额）
const trendKey = ref<'件数' | '销售额'>('件数')

// 折线图配置
// 折线图配置
const option = ref<any>({
  tooltip: { trigger: 'axis' },
  legend: { data: [], textStyle: { color: '#CBCDD1' } },
  grid: { left: '3%', right: '3%', bottom: '10%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: [] },
  yAxis: { type: 'value', splitLine: {
    lineStyle: {
      // 使用深浅的间隔色
      color: '#CBCDD1',
    },
  } },
  series: [],
  // ✅ 添加缩放交互
  dataZoom: [
    {
      type: 'inside', // 鼠标滚轮 / 手势缩放
      throttle: 50, // 性能优化，50ms触发一次
    },
  ],
})

// 更新折线图数据
function updateChart() {
  if (!props.date)
    return

  const dates = Object.keys(props.date)
  const values = dates.map(d => Number(props.date[d]?.[trendKey.value] ?? 0))

  option.value.xAxis.data = dates
  option.value.series = [
    {
      name: trendKey.value,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      data: values,
    },
  ]
  option.value.legend.data = [trendKey.value]
}

// ✅ 表格列（件数 / 销售额）
const columns = computed<DataTableColumns>(() => [
  { title: '日期', key: '日期', fixed: 'left', width: 120 },
  { title: '件数', key: '件数', width: 120 },
  { title: '销售额', key: '销售额', width: 120 },
])

// ✅ 表格行（每一行是一个日期）
const data = computed(() => {
  if (!props.date)
    return []

  return Object.entries(props.date).map(([date, val]) => ({
    日期: date,
    件数: val['件数'] ?? 0,
    销售额: val?.销售额 ?? 0,
  }))
})

// 监听数据 & 维度变化
watch([() => props.date, trendKey], updateChart, { deep: true, immediate: true })
const colorMode = useColorMode()
const tdColor = computed(() => {
  return colorMode.value === 'light' ? '#1A6DD8' : '#fff'
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#CBCDD1" size="large">
    <div
      uno-bg="[linear-gradient(180deg,_#daeaff_0%,_#ffffff_30.77%,_#ffffff_71.15%)]"
      uno-dark:bg="[linear-gradient(0deg,_#1D2C60,_#1D2C60)]"
      class="bg py-[12px] px-[16px] rounded-[8px] mt-[16px] overflow-hidden">
      <div class="w-[100%] flex justify-between items-center  pb-[16px]">
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
        <!-- 趋势维度切换 -->
        <div class="flex justify-center gap-2 my-4 flex-wrap">
          <div
            class="px-4 py-1 text-sm rounded-full cursor-pointer"
            :class="trendKey === '件数' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'"
            @click="trendKey = '件数'"
          >
            件数
          </div>
          <div
            class="px-4 py-1 text-sm rounded-full cursor-pointer"
            :class="trendKey === '销售额' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'"
            @click="trendKey = '销售额'"
          >
            销售额
          </div>
        </div>

        <!-- 折线图容器 -->
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
            '--n-merged-td-color': colorMode.value === 'light' ? '#fff' : '#1D2C60',
            '--n-merged-td-text-color': colorMode.value === 'light' ? '#1A6DD8' : '#fff',
            '--n-merged-td-color-hover': colorMode.value === 'light' ? '#DAEAFF' : '#0050B8',
            '--n-merged-th-color': colorMode.value === 'light' ? '#F3F3F3' : '#0F1E52',
            '--n-merged-border-color': 'rgba(57,113,243,0.0)',
            '--td-color': tdColor,
          }"
          :columns="columns"
          :data="data"
          bordered
          :max-height="350"
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
  box-shadow: 0px 5px 20px 0px #0000000a;
}
:deep(.n-data-table .n-data-table-base-table-header) {
  border-radius: 8px;
}
:deep(.n-data-table-tr:hover .n-data-table-td) {
  color: var(--td-color);
}
</style>
