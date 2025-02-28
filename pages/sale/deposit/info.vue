<script setup lang="ts">
const list = ref([
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
])
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <sale-add-card title="标题" :list="list" />
      <!-- 产品信息 -->
      <div class="info">
        <!-- header -->
        <common-gradient title="产品信息(3)" theme="gradient" :italic="true">
          <template #body>
            <!-- info -->
            <sale-order-product />
          </template>
        </common-gradient>
      </div>
      <!-- 结算信息 -->
      <sale-add-card title="结算信息" :list="list">
        <template #footer>
          <div class="mx-[16px] py-[12px] border-t-[#E6E6E8] border-t-[1px] border-t-solid">
            <div class="flex flex-col items-end gap-[8px]">
              <div class="flex-center-row gap-[4px] text-[16px] font-semibold text-[#FF2F2F]">
                <span>实付金额</span>
                <span>2399.00</span>
              </div>
              <div class="flex-center-row gap-[4px] text-[16px] font-semibold text-[#3971F3]">
                <span>支付方式</span>
                <span>微信支付</span>
              </div>
            </div>
          </div>
        </template>
      </sale-add-card>
      <common-button-bottom />
    </div>
  </div>
</template>

<style scoped lang="scss">
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
</style>
