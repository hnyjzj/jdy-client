<!-- 会员分析 -->
<script lang="ts" setup>
useSeoMeta({
  title: '会员分析',
})

const time1 = ref()
const time2 = ref()
</script>

<template>
  <div class="px-[16px]">
    <div class="flex justify-between items-center py-[12px]">
      <product-manage-company />
      <product-filter-senior />
    </div>
    <div class="mt-[12px]">
      <common-fold title="老会员复购率" from-color="rgba(71,126,245,0.8)" to-color="rgba(243,245,254,0.6)" :is-collapse="false">
        <div class="p-[16px]">
          <div>
            <div class="text-color text-[14px]">
              基准时段
            </div>
            <div class="pt-[8px]">
              <n-time-picker v-model:value="time1" :actions="['now', 'clear']" />
            </div>
          </div>
          <div class="py-[16px]">
            <div class="text-color text-[14px]">
              统计时段
            </div>
            <div class="pt-[8px]">
              <n-time-picker v-model:value="time2" :actions="['now', 'clear']" />
            </div>
          </div>
          <common-button-rounded content="开始计算" />
        </div>
      </common-fold>
    </div>
    <analyze-vip-list />
  </div>
</template>

<style lang="scss" scoped>

</style>
