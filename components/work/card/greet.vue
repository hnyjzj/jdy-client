<script setup lang="ts">
const userinfo = ref()

onMounted(async () => {
  userinfo.value = await useUser().userinfo
})
</script>

<template>
  <div class="mb-[8px]">
    <div class="text-size-xl line-height-[24px] font-semibold color-[#fff]">
      {{ getGreeting() }},{{ userinfo?.Attributes?.userID || '' }}
    </div>
    <div class="text-size-[14px] line-height-[24px] color-[#fff] mt-[8px]">
      {{ getDayAndWeek() }}
    </div>
  </div>
</template>
