<template>
  <div class="py-[14px] px-[16px] blur-bgc rounded-[16px]">
    <div class="">
      <nuxt-link to="/my/user/information" class="color-[#000]">
        <div class="flex-between">
          <div class="flex-center-row">
            <icon name="i-svg:my-profile" size="32" />
            <div class="font-semibold text-[14px] line-height-[20px] ml-[8px] dark:color-[#fff]">
              资料管理
            </div>
          </div>
          <van-icon name="arrow" size="20px" class="color-[#808089]" />
        </div>
        <div class="mb-[24px] mt-[12px] w-full h-[1px] bg-[#E6E6E8]" />
      </nuxt-link>
    </div>
    <div class="">
      <div class="flex-between">
        <div class="flex-center-row">
          <icon name="i-svg:my-setting" size="32" />
          <div class="font-semibold text-[14px] line-height-[20px]  ml-[8px] dark:color-[#fff]">
            提醒设置
          </div>
        </div>
        <van-icon name="arrow" size="20px" class="color-[#808089]" />
      </div>
      <div class="mb-[24px] mt-[12px] w-full h-[1px] bg-[#E6E6E8]" />
    </div>
    <div class="">
      <div class="flex-between">
        <div class="flex-center-row">
          <icon name="i-svg:my-question" size="32" />
          <div class="font-semibold text-[14px] line-height-[20px]  ml-[8px] dark:color-[#fff]">
            问题反馈
          </div>
        </div>
        <van-icon name="arrow" size="20px" class="color-[#808089]" />
      </div>
    </div>
  </div>
</template>
