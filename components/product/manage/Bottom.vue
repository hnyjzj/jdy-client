<script setup lang="ts">
const props = defineProps<{
  statistics: FinisheStatistics
}>()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0">
    <div
      class="text-black dark:text-[#FFF] px-[16px] py-[10px] blur-bgc dark:border-[#0000001A] b-t-solid border-color-[#E6E6E8] b-t-[1px]">
      <common-layout-center>
        <div class="flex">
          <div class="item">
            <div class="title">
              总数
            </div>
            <div class="number">
              {{ props.statistics.total }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              总入网费
            </div>
            <div class="number">
              {{ props.statistics.access_fee }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              总标签价
            </div>
            <div class="number">
              {{ props.statistics.label_price }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              总金重
            </div>
            <div class="number">
              {{ props.statistics.weight_metal }}
            </div>
          </div>
        </div>
      </common-layout-center>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .item {
  --uno: 'w-25% text-center px-2';
  .title {
    --uno: 'text-size-[12px]';
  }
  .number {
    --uno: 'text-size-[14px] text-row-hide';
  }
}
</style>
