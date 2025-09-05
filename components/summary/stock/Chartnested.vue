<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'

const props = defineProps<{
  stockCategoryDate: any
  title: string
  loading: boolean
}>()

// 图表 / 列表切换
const chartMode = ref<'list' | 'chart'>('list')

// 当前选中的大类（第一层）
const bigCategory = ref<string>('')

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
    textStyle: { color: '#666666', fontSize: 12 },
    type: 'scroll',
    pageIconColor: '#999',
    pageIconSize: 12,
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
  graphic: [
    {
      type: 'text',
      left: '50%',
      top: '50%',
      style: {
        text: '总计\n0',
        textAlign: 'center',
        textVerticalAlign: 'middle',
        fill: '#3971F3',
        fontSize: 20,
        fontWeight: 'bold',
      },
    },
  ],
})

// 更新饼图数据
function updateChart() {
  if (!props.stockCategoryDate || !bigCategory.value)
    return

  const dimData = props.stockCategoryDate[bigCategory.value]?.[chartBar.value]
  if (!dimData) {
    option.value.series[0].data = []
    option.value.graphic[0].style.text = '总计\n0'
    return
  }

  const chartData = Object.entries(dimData).map(([name, value]) => ({
    name,
    value: Number(value),
  }))

  option.value.series[0].data = chartData

  // 总计
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  option.value.graphic[0].style.text = `总计\n${total}`
}

// 动态生成表格列
const columns = computed<DataTableColumns>(() => {
  const dims = Object.keys(props.stockCategoryDate?.[bigCategory.value] || {})
  return [
    ...dims.map(dim => ({ title: dim, key: dim, width: 100 })),
  ]
})

// 动态生成表格数据
const data = computed(() => {
  if (!props.stockCategoryDate || !bigCategory.value)
    return []

  const dims = props.stockCategoryDate[bigCategory.value]
  const subCategories = new Set<string>()

  for (const dim in dims) {
    Object.keys(dims[dim] || {}).forEach(sub => subCategories.add(sub))
  }

  return Array.from(subCategories).map((sub) => {
    const row: Record<string, any> = { 大类: bigCategory.value, 小类: sub }
    for (const dim in dims) {
      row[dim] = dims[dim]?.[sub] ?? 0
    }
    return row
  })
})

// 监听数据变化，初始化大类
watch(
  () => props.stockCategoryDate,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      // 默认选中对象的第一个 key
      bigCategory.value = Object.keys(val)[0]
      updateChart()
    }
  },
  { immediate: true },
)

// 监听大类 / 维度变化，更新图表
watch(bigCategory, () => updateChart())
watch(chartBar, () => updateChart())

// 切换到图表模式时刷新一次
watch(chartMode, (val) => {
  if (val === 'chart') {
    nextTick(() => updateChart())
  }
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#fff" size="large">
    <div class="mt-[16px] overflow-hidden">
      <common-fold
        :is-collapse="false"
        from-color="rgba(71,126,245,0.6)"
        to-color="rgba(243,245,254,0.6)"
      >
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
          <!-- 大类选择 -->
          <div class="flex justify-center items-center gap-6 bg-[#224879]">
            <div class="flex justify-center gap-2 my-2">
              <n-select
                v-model:value="bigCategory"
                :options="Object.keys(props.stockCategoryDate || {}).map(key => ({ label: key, value: key }))"
                class="w-[200px]"
                placeholder="请选择大类"
              />
            </div>

            <!-- 维度选择 -->
            <div class="flex justify-center gap-2 my-4 flex-wrap">
              <template
                v-for="(key, idx) in Object.keys(props.stockCategoryDate?.[bigCategory] || {})"
                :key="idx"
              >
                <div
                  class="px-4 py-1 text-sm rounded-full cursor-pointer"
                  :class="chartBar === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'"
                  @click="chartBar = key"
                >
                  {{ key }}
                </div>
              </template>
            </div>
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
          <!-- 大类选择 -->
          <div class="flex gap-2 my-2 ml-2">
            <n-select
              v-model:value="bigCategory"
              :options="Object.keys(props.stockCategoryDate || {}).map(key => ({ label: key, value: key }))"
              class="w-[200px]"
              placeholder="请选择大类"
            />
          </div>

          <!-- 表格 -->
          <n-data-table
            :columns="columns"
            :data="data"
            :style="{
              '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : 'rgba(71, 126, 245, 0.6)',
              '--n-merged-td-color': $colorMode.value === 'light' ? 'rgba(0,0,0,0)' : '#224879',
              '--n-merged-border-color': 'rgba(57,113,243,0.08)',
            }"
            bordered />
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
