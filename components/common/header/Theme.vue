<script setup lang="ts">
// 主题色渐变边框
const props = withDefaults(defineProps<{
  title: string
}>(), {
  title: '',
})
</script>

<template>
  <div class="flex-center-between shrink-0 px-[16px] py-[8px] bg-[linear-gradient(90deg,#477ef500,#82d0faf2)]">
    <div class="flex-center-between gap-2 flex-1">
      <slot name="avatar" />
      <div class="text-[14px] font-semibold color-[#1B2129] dark:color-[#fff]">
        {{ props.title }}
      </div>
    </div>
    <slot />
  </div>
</template>
