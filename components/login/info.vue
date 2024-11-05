<script setup lang="ts">
const store = useUser()

const loginBtn = async () => {
  const res = await store.mockLogin()

  if (res) {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="cardbox blur-bgc rounded-[16px]">
    <div>
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        手机号
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px]">
        <input
          type="text" class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none " placeholder="全部"
        >
      </div>
    </div>

    <div class="mt-[32px]">
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        密码
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px] ">
        <form>
          <input
            type="password" autocomplete=" " class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none" placeholder="密码"
          >
        </form>
      </div>
    </div>

    <div class="text-size-[16px]  font-semibold offset-5 mt-[32px]">
      <div class="ok " @click="loginBtn()">
        登录
      </div>
    </div>

    <div class="px-[20px] mt-[112px] flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        其他登录方式
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <div class="flex-center-row py-[24px]">
      <div class="wh-[32px] rounded-full bg-blue" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardbox {
  --uno: 'px-[23px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px  pt-36px';
  .ok {
    --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
  }
}
</style>
