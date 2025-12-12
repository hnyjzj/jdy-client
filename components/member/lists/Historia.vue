<script setup lang="ts">
</script>

<template>
  <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <common-card-info title="顾客通知">
      <template #info>
        <div class="box flex flex-col gap-[12px]">
          <div class="item">
            <div class="left">
              通知内容
            </div>

            <div class="right">
              订金单核销
            </div>
          </div>

          <div class="item">
            <div class="left">
              通知名称
            </div>

            <div class="right">
              订金单核销
            </div>
          </div>

          <div class="item">
            <div class="left">
              接收手机
            </div>

            <div class="right">
              15000000000
            </div>
          </div>

          <div class="item">
            <div class="left">
              消耗短信条数
            </div>

            <div class="right">
              1
            </div>
          </div>
        </div>
      </template>
    </common-card-info>

    <common-card-info title="顾客通知">
      <template #info>
        <div class="box flex flex-col gap-[12px]">
          <div class="item">
            <div class="left">
              通知内容
            </div>

            <div class="right">
              订金单核销
            </div>
          </div>

          <div class="item">
            <div class="left">
              通知名称
            </div>

            <div class="right">
              订金单核销
            </div>
          </div>

          <div class="item">
            <div class="left">
              接收手机
            </div>

            <div class="right">
              15000000000
            </div>
          </div>

          <div class="item">
            <div class="left">
              消耗短信条数
            </div>

            <div class="right">
              1
            </div>
          </div>
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#666666]';
  }
}
</style>
