<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: any[]
  list?: BossSalesList[]
  loading?: boolean
  chart?: any
  isToggle?: boolean
}>(), {
  isToggle: true,
})
const { $colorMode } = useNuxtApp()
const scrollX = ref(0)

for (let i = 0; i < props.title.length; ++i) {
  scrollX.value += 100
}
const toggleChart = defineModel({ default: 'list' })
const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      triggerOn: 'click',
      confine: true,
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`
        const total = params.reduce((acc: number, cur: any) => acc + cur.value, 0)
        // 添加合计行
        result += `<span style="color:#ff6b35;font-weight:bold">合计: ${total.toFixed(2)}</span><br/>`
        // 遍历数据项，添加到结果中
        params.forEach((item: any) => {
          if (item.value) {
            result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`
          }
        })
        return result
      },
    },
    legend: {
      data: props.title
        .filter((item: StockTitle) => item.title !== '门店' && item.title !== '合计')
        .map((item: StockTitle) => item.title),
      left: 'center',
      top: 10,
      itemShape: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#666666' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.list?.map((item: BossSalesList) => item.name),
      axisLabel: {
        rotate: 45,
        interval: 0,
        width: 120,
        overflow: 'truncate',
      },
    },
    yAxis: {
      type: 'value',
      axisTick: { show: false },
      splitLine: { show: false },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 30,
      },
      {
        type: 'slider',
        start: 0,
        end: 30,
        bottom: 10,
        height: 20,
      },
    ],
    series: props.title.filter((item: StockTitle) => item.title !== '门店' && item.title !== '合计')
      .map((item: StockTitle, index) => {
        return {
          name: item.title,
          type: 'bar',
          stack: 'total',
          data: props.list?.map((salesItem: BossSalesList) => {
            const key = item.title === '合计' ? 'total' : item.title
            return Number(salesItem[key as keyof BossSalesList]) || 0
          }),
          itemStyle: {
            color: `hsl(${(index * 50) % 360}, 100%, 80%)`,
          },
        }
      }),
  }
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#fff" size="large">
    <div class="blur-bgc rounded-[16px]  overflow-hidden mb-[16px]" data-allow-mismatch="style">
      <div class=" rounded-[4px] p-[20px]">
        <div class="text-[16px] font-bold ">
          <div class="flex items-center gap-[12px] justify-between">
            <slot name="header-title" />
            <template v-if="props.isToggle">
              <div
                class="text-[14px] font-normal text-[#666666] bg-[#fff] px-[12px] py-[3px] rounded-[4px] cursor-pointer"
                @click="toggleChart = toggleChart === 'list' ? 'chart' : 'list'">
                <template v-if="toggleChart === 'list'">
                  <div class="flex gap-[6px]">
                    <icon name="i-icon:chart-boss" color="#0068FF" :size="16" />
                    <span class="text-[12px]">图表</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex gap-[6px]">
                    <icon name="i-icon:table-boss" color="#0068FF" :size="16" />
                    <span class="text-[12px]">表格</span>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
        <slot name="select" />
      </div>

      <div v-if="toggleChart === 'list'">
        <n-data-table
          :style="{
            '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : '#1A6BEB',
            '--n-merged-td-color': $colorMode.value === 'light' ? 'rgba(0,0,0,0)' : '#224879',
            '--n-merged-border-color': 'rgba(57,113,243,0.08)',
          }"
          :columns="props.title"
          :data="props.list"
          :scroll-x="scrollX"
          :max-height="450"
          :bordered="true"
          :render-cell="(value: any) => {
            if (!value){
              return 0
            }
            return value
          }"
        />
      </div>
      <div v-if="toggleChart === 'chart'">
        <VChart class="chart" :option="option" />
      </div>
    </div>
  </n-spin>
</template>

<style lang="scss" scoped>
.items-title {
  --uno: 'col-2 text-center color-#4B576D  flex-grow-1 flex-shrink-0 px-[10px] py-[6px] bg-[rgba(199,218,255,0.8)] ';
}
.items {
  --uno: 'col-2 text-center color-[#3971F3] dark:color-[#fff] flex-grow-1 flex-shrink-0  px-[10px] py-[6px]';
}
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.skew-text {
  display: flex;
  align-items: flex-start;
}
.chart {
  width: 100%;
  height: 530px;
}
</style>
