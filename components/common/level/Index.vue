<script setup lang="ts">
const props = defineProps<{
  desc: string
}>()
</script>

<template>
  <div class="bg-[#F5F5F5] rounded-6 pr-[10px] box">
    <div class="flex flex-row items-center gap-1">
      <img src="/images/sale/level-diamond.png" class="w-[20px] h-[20px]">
      <span class="text-[12px] color-[#FFB13C] font-medium">{{ props.desc || '' }}</span>
    </div>
  </div>
</template>

<style scoped>
.box {
  background: radial-gradient(#000060 0%, #011830 100%);
}
</style>
