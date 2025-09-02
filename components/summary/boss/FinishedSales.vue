<script lang="ts" setup>
const emits = defineEmits<{
  getlist: []
}>()
const { finishedSalesFilterList, finishedSalesTitle, finishedSalesList } = storeToRefs(useStock())
const radioValueFinsihed = defineModel<Revenue['type']>({ default: 1 })
const toggleChart = ref<'list' | 'chart'>('list')

// 图表数据
const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器
      type: 'shadow',
    },
  },
  legend: {
    data: ['标签价', '入网费', '金重', '件数'],
    orient: 'horizontal',
    left: 'center',
    top: 'bottom',
    itemShape: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: '#666666' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'category',
    data: ['足金(克)', '足金(件)', '金(750)', '金(710)', '铂金', '银饰'],
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      name: '件数',
      type: 'bar',
      stack: 'total',
      data: [0, 200, 150, 80, 15, 35],
      itemStyle: { color: 'rgba(65,207,132,1)' },
    },
    {
      name: '金重',
      type: 'bar',
      stack: 'total',
      data: [10, 46, 64, 0, 60.12, 0],
      itemStyle: { color: 'rgba(240,224,77,1)' },
    },
    {
      name: '入网费',
      type: 'bar',
      stack: 'total',
      data: [30, 20, 40, 20, 50, 74],
      itemStyle: { color: 'rgba(255,177,60,1)' },
    },
    {
      name: '标签价',
      type: 'bar',
      stack: 'total',
      data: [30, 30, 60, 20, 60, 75],
      itemStyle: {
        color: 'rgba(47,76,255,1)',
        borderRadius: [0, 10, 10, 0], // 横向时，右侧加圆角
      },
    },
  ],
  label: {
    show: true,
    position: 'inside',
    color: '#fff',
  },
})
</script>

<template>
  <div>
    <summary-stock-table v-model="toggleChart" :title="finishedSalesTitle" :stock-list="finishedSalesList" :chart="option">
      <template #header-title>
        <div>成品销售</div>
      </template>
      <template #toggle>
        <div
          class="text-[14px] font-normal text-[#666666] bg-[#fff] px-[12px] py-[3px] rounded-[4px] cursor-pointer"
          @click="toggleChart = toggleChart === 'list' ? 'chart' : 'list'">
          {{ toggleChart === 'list' ? '切换图表' : '切换列表' }}
        </div>
      </template>
      <template #header-right>
        <n-radio-group
          v-model:value="radioValueFinsihed" name="radiogroup" @update:value="emits('getlist')">
          <n-radio
            v-for="(item, index) in finishedSalesFilterList?.type?.preset" :key="item" :value="Number(index)" :style="{
              '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
              '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
              '--n-dot-color-active': '#0068ff',
              '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
            {{ item }}
          </n-radio>
        </n-radio-group>
      </template>
    </summary-stock-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
