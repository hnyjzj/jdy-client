<script lang="ts" setup>
const props = defineProps<{
  option: any
}>()
const chartBar = ref(['数据', '占比'])
const selectChartBar = ref(0)
async function goDetail() {
  jump('/summary/stock/detail', { a: 1 })
}
</script>

<template>
  <div class="mt-[16px]">
    <common-fold :is-collapse="false" from-color="rgba(71,126,245,0.6)" to-color="rgba(243,245,254,0.6)">
      <template #title>
        <div class="w-[100%] flex justify-between items-center">
          <div class="text-[14px]">
            库存大类分布
          </div>
          <div @click="goDetail">
            <span class="text-[rgba(96,98,102,1)]">详情</span>
            <van-icon name="arrow" color="rgba(96,98,102,1)" />
          </div>
        </div>
      </template>
      <div class="flex justify-center mt-[16px]">
        <div class="bar">
          <template v-for="(bar, barIndex) in chartBar" :key="barIndex">
            <div class="baritem" :class="barIndex === selectChartBar ? 'selectBar' : ''" @click="selectChartBar = barIndex">
              {{ bar }}
            </div>
          </template>
        </div>
      </div>
      <div class="pb-[14px]">
        <ClientOnly fallback-tag="div" fallback="加载中...">
          <VChart class="chart" :option="props.option" />
        </ClientOnly>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  height: 330px;
}
.bar {
  --uno: 'rounded-[24px] flex bg-[rgb(245,245,245)]';
  border: 1px #e6e6e8 solid;
  .baritem {
    --uno: 'py-[8px] px-[26px] text-[14px] font-400 text-#666666';
  }
  .selectBar {
    --uno: 'text-#3971F3 bg-#FFFFFF rounded-[24px]';
  }
}
</style>
