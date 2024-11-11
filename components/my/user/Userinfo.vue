<script setup lang="ts">
const userinfo = useUser().userinfo
</script>

<template>
  <div class="flex-between color-[#fff]">
    <nuxt-link to="/login" class="color-[#fff]">
      <div class="flex-start ">
        <div class="wh-[68px] bg-amber rounded-full" />
        <div class="ml-[8px]">
          <div class="mb-[4px] font-semibold text-[16px] line-height-[20px]">
            {{ userinfo.Attributes.userID }}
          </div>
          <div class="text-[14px] line-height-[20px]" />
        </div>
      </div>
    </nuxt-link>

    <div class="flex-end">
      <div class="mr-[4px] text-[14px] line-height-[20px]">
        编辑资料
      </div>
      <van-icon name="arrow" size="20px" />
    </div>
  </div>
</template>
