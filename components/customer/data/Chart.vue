<script lang="ts" setup>
const props = defineProps<{
  data: any[]
}>()
const option = ref({
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      label: {
        show: true,
        position: 'center',
        formatter: '80%', // 显示标签名和百分比
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3971F3',
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 20,
          name: '20%',
          itemStyle: {
            color: '#fff',
          },
          emphasis: {
            scale: false,
            itemStyle: {
              shadowBlur: 0,
            },
          },
        },
        {
          value: 80,
          name: '80%', // 用于显示在中间的百分比
          itemStyle: {
            color: '#3971F3',
            borderRadius: '50%',
          },
          emphasis: {
            scale: false,
            itemStyle: {
              shadowBlur: 0,
            },
          },
        },
      ],
    },
  ],
})
</script>

<template>
  <div class="data">
    <div>
      <div class="flex items-center">
        <div class="mark" />
        <div class="text-[12px] font-normal text-color">
          成交率
        </div>
      </div>
      <div>
        <VChart class="chart" :option="option" />
      </div>
    </div>
    <div>
      <template v-for="(item, index) in props.data.slice(1, 4)" :key="index">
        <div class="flex mt-2">
          <div class="obj">
            <div class="flex items-center">
              <div class="mark" />
              <div class="text-[12px] font-normal text-color">
                {{ item.name }}
              </div>
            </div>
            <div class="text-[16px] text-[#3971F3] font-semibold mt-1">
              {{ item.value }}个
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data {
  --uno: 'mt-16px grid grid-cols-[1fr_1fr] gap-y-16px text-12px';
  .chart {
    width: 120px;
    height: 120px;
  }
  .obj {
    --uno: 'flex flex-col items-center font-400';
  }
  .mark {
    --uno: 'w-4px h-10px rounded-4px bg-[#3971F3] mr-1';
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  }
}
</style>
