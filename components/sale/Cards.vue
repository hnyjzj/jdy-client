<script setup lang="ts">
// 通用_列表_卡片
const props = defineProps<{
  title: string
  info: SalesSlip
  tagText?: string
}>()
</script>

<template>
  <div class="card">
    <!-- header -->
    <div class="flex-center-between shrink-0 px-[16px] py-[8px] bg-[linear-gradient(90deg,#477ef500,#82d0faf2)]">
      <div class="flex-center-between gap-2 flex-1">
        <slot name="avatar" />
        <div class="text-[14px] font-semibold color-[#1B2129] dark:color-[#fff]">
          {{ props.title }}
        </div>
      </div>
      <template v-if="props.tagText">
        <common-tags :text="props.tagText" />
      </template>
    </div>
    <!-- info -->
    <slot name="info" />
  </div>
</template>

<style lang="scss" scoped>
.card {
  --uno: 'flex flex-col gap-[12px] rounded-[24px] gap-4 bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] overflow-hidden dark:border-[rgb(239,240,246,0.1)]';
}
</style>
