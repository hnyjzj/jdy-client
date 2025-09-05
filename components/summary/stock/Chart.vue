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
    bottom: 0, // 放在底部
    itemGap: 12,
    textStyle: { color: '#666666', fontSize: 12 },
    type: 'scroll', // 横向滚动
    pageIconColor: '#999',
    pageIconSize: 12,
  },
  series: [
    {
      type: 'pie',
      radius: ['35%', '60%'], // 缩小饼图留空间给 legend
      center: ['50%', '45%'], // 上移给 legend 空间
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: {
        show: true,
        position: 'outside', // 标签显示在饼图外部
        formatter: '{b}\n{d}%',
        fontSize: 12,
      },
      labelLine: { show: true, length: 12, length2: 8 },
    },
  ],
  graphic: [
    {
      type: 'text',
      left: '50%',
      top: '50%',
      style: {
        text: '总计\n0', // 默认文字
        textAlign: 'center',
        textVerticalAlign: 'middle', // ✅ 关键：垂直居中
        fill: '#3971F3',
        fontSize: 20,
        fontWeight: 'bold',
      },
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

// 动态生成表格列
const columns = computed<DataTableColumns>(() => {
  const row = Object.keys(props.stockCategoryDate || {})
  return [
    { title: '分类', key: '分类', fixed: 'left', width: 120 },
    ...row.map(item => ({ title: item, key: item, width: 100 })),
  ]
})

// 动态生成表格数据
const data = computed(() => {
  if (!props.stockCategoryDate)
    return []
  const keys = Object.keys(props.stockCategoryDate)
  const categories = Array.from(new Set(keys.flatMap(key => Object.keys(props.stockCategoryDate[key] || {}))))
  return categories.map((category) => {
    const row: Record<string, any> = { 分类: category }
    keys.forEach((val) => {
      row[val] = props.stockCategoryDate[val]?.[category] ?? 0
    })
    return row
  })
})

// 监听数据和维度变化更新图表
watch([() => props.stockCategoryDate, chartBar], updateChart)
</script>

<template>
  <n-spin :show="props.loading" stroke="#fff" size="large">
    <div class="mt-[16px] overflow-hidden">
      <common-fold :is-collapse="false" from-color="rgba(71,126,245,0.6)" to-color="rgba(243,245,254,0.6)">
        <template #title>
          <div class="w-[100%] flex justify-between items-center">
            <div class="text-[14px]">
              {{ props.title }}
            </div>
            <div>
              <summary-Toggle v-model="chartMode" />
            </div>
          </div>
        </template>

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
              '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : 'rgba(71, 126, 245, 0.6)',
              '--n-merged-td-color': $colorMode.value === 'light' ? 'rgba(0,0,0,0)' : '#224879',
              '--n-merged-border-color': 'rgba(57,113,243,0.08)',
            }"
            :columns="columns"
            :data="data"
            bordered
          />
        </template>
      </common-fold>
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
</style>
