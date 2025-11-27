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

const emits = defineEmits<{
  clickTitle: []
}>()
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

    },
    legend: {
      data: props.title
        .filter((item: StockTitle) => item.title !== '门店' && item.title !== '支付方式')
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
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#505372',
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 14,
      },
      {
        type: 'slider',
        start: 0,
        end: 14,
        bottom: 10,
        height: 20,
      },
    ],
    series: [
      {
        name: '合计',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        data: props.list?.map((salesItem: BossSalesList) =>
          Number(salesItem.total) || 0,
        ),
        itemStyle: {
          color: '#505372',
        },
      },
      ...props.title.filter((item: StockTitle) => item.title !== '门店' && item.title !== '合计')
        .map((item: StockTitle, index) => ({
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
        })),

    ],
  }
})
</script>

<template>
  <n-spin :show="props.loading" stroke="#fff" size="large">
    <div class="bg pb-[16px] rounded-[16px] overflow-hidden mb-[16px]" data-allow-mismatch="style">
      <div>
        <div class="flex justify-between items-center pt-[12px] pb-[16px] px-[16px]">
          <div class="color-[#1A6DD8] flex gap-[6px] text-[16px] font-semibold line-height-[24px]" @click="emits('clickTitle')">
            <img src="/images/icon/today-sale.png" class="wh-[24px]">
            <slot name="header-title" />
          </div>
          <div class="col-6 flex-end" uno-md="col-4 offset-8">
            <template v-if="props.isToggle">
              <div
                class="text-[14px] font-normal text-[#666666]  py-[3px] rounded-[4px] cursor-pointer"
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

      <div v-if="toggleChart === 'list'" class="px-[16px]">
        <n-data-table
          :style="{
            '--n-merged-td-color-hover': '#DAEAFF',
            '--n-merged-td-color': $colorMode.value === 'light' ? '#fff' : '#224879',
            '--n-merged-th-color': $colorMode.value === 'light' ? '#F3F3F3' : '#224879',
            '--n-merged-border-color': 'rgba(57,113,243,0.0)',
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
.bg {
  background: linear-gradient(180deg, #daeaff 0%, #ffffff 30.77%, #ffffff 71.15%);
  box-shadow: 0px 5px 20px 0px #0000000a;
}
:deep(.n-data-table .n-data-table-th) {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
