<script setup lang="ts">
const props = defineProps<{
  userinfo: UserInfo
}>()
</script>

<template>
  <div class="mb-[8px]">
    <div class="text-size-xl line-height-[24px] font-semibold color-[#fff]">
      {{ props.userinfo?.nickname ? `${getGreeting()},${props.userinfo?.nickname}` : '' || '' }}
    </div>
    <div class="text-size-[14px] line-height-[24px] color-[#fff] mt-[8px]">
      {{ getDayAndWeek() }}
    </div>
  </div>
</template>
