<script setup lang="ts">
const handleClick = async () => {
  // 跳转到搜索商品页
  await navigateTo('/sale/search/product')
}
</script>

<template>
  <common-fold title="产品信息" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12 gap-[20px]">
        <div class="btn-left col-span-4 offset-2 cursor-pointer">
          <icon name="i-icon:search" color="#fff" :size="12" />
          <div class="ml-2" @click="handleClick">
            搜商品
          </div>
        </div>
        <div
          class="btn-right col-span-4 cursor-pointer"
        >
          <icon name="i-icon:scanit" color="#1a6beb" :size="12" />
          <div class="ml-2">
            扫商品
          </div>
        </div>
      </div>
    </div>
    <template v-if="false">
      <div class="flex justify-center">
        <div class="w-[30%]">
          <common-empty :show-r-t="false" />
        </div>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] py-[8px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[8px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
.product {
  --uno: 'w-[150px] h-[150px] rounded-[50%] relative';
  box-shadow: rgba(239, 242, 255, 1) 0 5px 20px 0;
  .bag {
    --uno: 'absolute top-[26px] left-[14px]';
  }
  .super {
    --uno: 'absolute top-[14px] right-[14px]';
    &-bg {
      --uno: 'w-[36px] h-[36px] rounded-[50%] bg-[#FFFFFF] flex justify-center items-center';
      background: linear-gradient(to bottom, rgba(255, 152, 152, 1), rgba(255, 79, 79, 1));
      box-shadow: 0 0 20px 2px rgba(255, 152, 152, 1);
    }
  }
}
</style>
