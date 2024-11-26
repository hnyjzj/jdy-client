<script setup lang="ts">
const porps = defineProps<{
  userinfo: UserInfo
}>()
</script>

<template>
  <div class="color-[#fff]">
    <div class="flex-start ">
      <div class="">
        <template v-if="!porps.userinfo?.avatar">
          <icon name="i-svg:avatar" size="68" />
        </template>
        <template v-else>
          <nuxt-img :src="porps.userinfo?.avatar" size="68px" />
        </template>
      </div>
      <div class="ml-[8px]">
        <div class="mb-[4px] font-semibold text-[16px] line-height-[20px]">
          {{ porps.userinfo?.nickname || '' }}
        </div>
        <div class="text-[14px] line-height-[20px]">
          {{ porps.userinfo?.phone || '' }}
        </div>
      </div>
    </div>
  </div>
</template>
