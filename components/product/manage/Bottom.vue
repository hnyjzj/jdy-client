<script setup lang="ts">

</script>

<template>
  <div class="fixed bottom-0 left-0 right-0">
    <div
      class="text-black dark:text-[#FFF] px-[16px] py-[10px] blur-bgc dark:border-[#0000001A] b-t-solid border-color-[#E6E6E8] b-t-[1px]">
      <common-layout-center>
        <van-row justify="space-between">
          <van-col span="6">
            <div class=" item">
              <div class="title">
                总入网
              </div>
              <div class="number">
                181231
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class=" item">
              <div class="title">
                总入网费
              </div>
              <div class="number">
                181231
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class=" item">
              <div class="title">
                总入网费
              </div>
              <div class="number">
                181231
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class=" item">
              <div class="title">
                总入网费
              </div>
              <div class="number">
                181231
              </div>
            </div>
          </van-col>
        </van-row>
      </common-layout-center>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .item {
  --uno: 'text-start';
  .title {
    --uno: 'text-size-[12px]';
  }
  .number {
    --uno: 'text-size-[14px]';
  }
}
</style>
