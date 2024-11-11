<script setup lang="ts">
// 渐变色边框
type AlignType = 'space-between' | 'start'
const props = defineProps<{
  title: string
  /**
   * 对齐方式
   */
  alignDesc?: AlignType
}>()
</script>

<template>
  <div
    class="flex flex-row gap-[8px] items-center px-4 py-2 bg-gradient-linear-[90deg,#8CADF8,#D8E7FD]"
    :style="{ justifyContent: props.alignDesc ? props.alignDesc : 'space-between' }"
  >
    <div class="font-black text-[#333333] italic text-[14px] dark:color-[#fff]">
      {{ props.title }}
    </div>
    <slot />
  </div>
</template>
