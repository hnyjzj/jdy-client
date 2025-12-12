<template>
  <div class="flex justify-between items-center pt-[12px]">
    <div class="text-[20px] flex-1 font-semibold flex flex-col gap-[6px] line-height-[24px] color-[#Fff] pl-[20px]">
      <div>你好!</div>
      <div class="text">
        欢迎进入金斗云
      </div>
    </div>
    <div class="transform translate-x-[20px]">
      <icon
        name="i-icon:login-icon"
        :size="145"
        color="#fff"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text {
  white-space: nowrap;
}
</style>
