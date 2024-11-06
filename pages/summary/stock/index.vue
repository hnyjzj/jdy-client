<script lang="ts" setup>
useSeoMeta({
  title: '库存统计',
})
const data = ref([
  { name: '成品总件数', value: 335 },
  { name: '成品总入网费', value: 310 },
  { name: '成品总金重', value: 234 },
  { name: '成品总标签价', value: 135 },
  { name: '旧料总件数', value: 135 },
  { name: '旧料总金重', value: 135 },
  { name: '旧料总抵值', value: 135 },
])

// 图表数据
const option = ref({
  tooltip: {
    trigger: 'item', // 鼠标悬停时触发提示框
    formatter(params: any) {
      // 自定义提示框内容
      const tooltipContent = `${params.name}<br/>` // 获取类目名称
      return tooltipContent
    },
  },
  legend: {
    data: ['标签价', '入网费', '金重', '件数'], // 图例的名称
    orient: 'horizontal', // 图例的布局方向
    left: 'center',
    top: 'bottom',
    itemShape: 'circle', // 设置图例项为圆形
    itemWidth: 8, // 设置圆形的宽度
    itemHeight: 8,
    margin: [40, 0],
    textStyle: {
      color: '#666666',
    },
  },
  xAxis: {
    type: 'category',
    data: ['足金(克)', '足金(件)', '金(750)', '金(710)', '铂金', '银饰'],
    axisTick: {
      show: false, // 让刻度隐藏
    },
    axisLine: {
      show: false, // 轴线隐藏
    },
    axisLabel: {
      interval: 0,
      formatter(value: string) {
        // 开始截取的位置
        const start = value.indexOf('(')
        // 结束截取的位置
        const end = value.indexOf(')')
        if (start !== -1 && end !== -1) {
          return `${value.substring(0, start)}\n${value.substring(start, end + 1)}`
        }
        else {
          return value
        }
      },
    },
  },
  yAxis: {
    show: false,
  },
  series: [
    {
      data: [0, 200, 150, 80, 15, 35],
      type: 'bar',
      stack: 'x',
      itemStyle: {
        color: 'rgba(65,207,132,1)',
      },
      name: '件数',
    },
    {
      data: [10, 46, 64, 0, 60.12],
      type: 'bar',
      stack: 'x',
      barWidth: '16px',
      itemStyle: {
        color: 'rgba(240,224,77,1)',
      },
      name: '金重',
    },
    {
      data: [30, 20, 40, 20, 50, 74],
      type: 'bar',
      stack: 'x',
      itemStyle: {
        color: 'rgba(255,177,60,1)',
      },
      name: '入网费',
    },
    {
      data: [30, 30, 60, 20, 60, 75],
      type: 'bar',
      stack: 'x',
      itemStyle: {
        borderRadius: [10, 10, 0, 0, 24], // 上边两个角圆角
        color: 'rgba(47,76,255,1)', // 自定义颜色
      },
      name: '标签价',
    },
  ],
})
</script>

<template>
  <div class="px-[16px]">
    <common-dark />
    <div class="flex justify-between items-center py-[12px]">
      <product-manage-company />
      <product-filter-senior />
    </div>
    <summary-total :data="data" title="库存统计数据汇总" />
    <summary-stock-chart :option="option" />
  </div>
</template>
