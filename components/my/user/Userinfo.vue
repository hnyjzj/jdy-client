<script setup lang="ts">
const porps = defineProps<{
  userinfo: UserInfo
  filterList: Where<Staff>
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <div class="color-[#fff] flex-between">
    <div class="flex-start ">
      <div class="cursor-pointer">
        <template v-if="!porps.userinfo?.avatar">
          <icon name="i-svg:avatar" :size="68" />
        </template>
        <template v-else>
          <img :src="ImageUrl(porps.userinfo?.avatar)" class="wh-[68px] rounded-full">
        </template>
      </div>
      <div class="ml-[8px] cursor-pointer">
        <div class="mb-[4px] font-semibold text-[16px] line-height-[20px]">
          {{ porps.userinfo?.nickname || '' }} - {{ filterList.identity?.preset[porps.userinfo?.identity] }}
        </div>
        <div class="text-[14px] line-height-[20px]">
          {{ porps.userinfo?.phone || '' }}
        </div>
      </div>
    </div>
    <div class="cursor-pointer" @click="emit('logout')">
      <icon name="i-svg:logout" :size="32" />
    </div>
  </div>
</template>
