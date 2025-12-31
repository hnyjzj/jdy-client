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
})

// 动态生成表格列（保证第一列是 分类）
const columns = computed<DataTableColumns>(() => {
  const dims = Object.keys(props.stockCategoryDate?.[bigCategory.value] || {})
  return [
    { title: '分类', key: '分类', fixed: 'left', width: 120 },
    ...dims.map(dim => ({ title: dim, key: dim, width: 120 })),
  ]
})

// 生成表格数据
const data = computed(() => {
  if (!props.stockCategoryDate || !bigCategory.value)
    return []

  const dims = props.stockCategoryDate[bigCategory.value] || {}
  const subCategories = new Set<string>()

  // 收集所有子分类
  for (const dim in dims) {
    Object.keys(dims[dim] || {}).forEach((sub) => {
      subCategories.add(sub)
    })
  }

  return Array.from(subCategories).map((sub) => {
    const row: Record<string, any> = { 分类: sub }
    for (const dim in dims) {
      row[dim] = dims[dim]?.[sub]
    }
    return row
  })
})

// 更新图表
function updateChart() {
  if (!props.stockCategoryDate || !bigCategory.value)
    return

  const dimData = props.stockCategoryDate[bigCategory.value]?.[chartBar.value]
  if (!dimData) {
    option.value.series[0].data = []
    return
  }

  option.value.series[0].data = Object.entries(dimData).map(([name, value]) => ({
    name,
    value,
  }))
}

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
  <n-spin :show="props.loading" stroke="#CBCDD1" size="large">
    <div
      class="mt-[16px] overflow-hidden bg"
      uno-bg="[linear-gradient(180deg,_#daeaff_0%,_#ffffff_30.77%,_#ffffff_71.15%)]"
      uno-dark:bg="[linear-gradient(0deg,_#1D2C60,_#1D2C60)]"
    >
      <div class="pb-[16px] w-[100%] flex justify-between items-center">
        <div class="flex items-center">
          <div class="flex pr-[6px] items-center gap-[6px] color-[#1A6DD8] font-semibold line-height-[24px] text-[16px]">
            <img src="/images/icon/today-sale.png" class="wh-[24px]">
            <span>{{ props.title }}</span>
          </div>
          <div class="flex my-2">
            <n-select
              v-model:value="bigCategory"
              :options="Object.keys(props.stockCategoryDate || {}).map(key => ({ label: key, value: key }))"
              class="min-w-[120px]"
              placeholder="请选择"
            />
          </div>
        </div>
        <div>
          <summary-Toggle v-model="chartMode" />
        </div>
      </div>

      <!-- 图表模式 -->
      <template v-if="chartMode === 'chart'">
        <!-- 大类选择 -->
        <div class="flex justify-center items-center gap-6">
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
        <summary-common-table :title="columns" :list="data" />
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
  padding: 12px 16px;
  border-radius: 8px;
}
</style>
