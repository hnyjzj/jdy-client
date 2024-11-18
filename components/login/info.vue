<script setup lang="ts">

</script>

<template>
  <div class="cardbox blur-bgc rounded-[16px]">
    <slot name="form" />

    <div class="px-[20px] mt-[112px] flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        其他登录方式
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <div class="flex-center-row py-[24px]">
      <slot name="other_logins" />
    </div>
  </div>
</template>
