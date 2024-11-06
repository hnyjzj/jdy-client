<script setup lang="ts">
const props = defineProps<{
  info: any[]
}>()
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <common-fold title="支付信息">
        <div class="grid-cols-[1fr] gap-[16px] px-[16px] py-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
          <div class="flex flex-col gap-[12px]">
            <template v-for="(item, index) in props.info" :key="index">
              <div class="flex items-center justify-between">
                <div class="color-[#666] dark:color-[#FFFFFF] text-[14px] flex-none">
                  {{ item.name }}
                </div>
                <div class="color-[#333] dark:color-[#FFFFFF] text-[14px] flex-none">
                  {{ item.desc }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </common-fold>

      <common-fold title="人员信息">
        <div class="grid-cols-[1fr] gap-[16px] px-[16px] py-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
          <div class="flex flex-col gap-[12px]">
            <div class="item">
              <span class="item-left">会员</span>
              <span class="item-right">李一一</span>
            </div>
            <div class="item">
              <span class="item-left">会员手机号</span>
              <span class="item-right">1500xxxxxx</span>
            </div>
            <div class="item">
              <span class="item-left">收银员</span>
              <span class="item-right">古月</span>
            </div>
            <div class="item">
              <span class="item-left">状态</span>
              <common-tags text="门店已收货" type="lake" />
            </div>
          </div>
        </div>
      </common-fold>

      <common-fold title="收支信息">
        <div class="grid-cols-[1fr] gap-[16px] px-[16px] py-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
          <div class="flex flex-col gap-[12px]">
            <div class="item">
              <span class="item-left">收支类型</span>
              <span class="item-right">收入</span>
            </div>
            <div class="item">
              <span class="item-left">收支来源</span>
              <span class="item-right">门店</span>
            </div>
            <div class="item">
              <span class="item-left">支付方式</span>
              <span class="item-right">微信</span>
            </div>
            <div class="item">
              <span class="item-left">结算金额</span>
              <span class="item-right">100.00</span>
            </div>
          </div>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}

.item {
  --uno: 'flex-center-between gap-[32px]';

  &-left {
    --uno: 'color-[#666] font-size-[14px] text-nowrap flex-none dark:color-[#CBCDD1]';
  }
  &-right {
    --uno: 'color-[#333] font-size-[14px] w-auto text-wrap self-start break-all dark:color-[#fff]';
  }
}
</style>
