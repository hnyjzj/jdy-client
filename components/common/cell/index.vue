<script lang="ts" setup>
const props = defineProps<{
  label: string
  value?: string | number
}>()
</script>

<template>
  <div class="part">
    <div class="part-left">
      {{ props.label }}
    </div>
    <div class="part-right">
      {{ props.value }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .part {
  --uno: 'flex-center-between';
  &-left {
    --uno: 'flex-1 text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
  }
  &-right {
    --uno: 'text-size-[14px] color-[#333] dark:color-[#fff]';
    white-space: wrap;
  }
}
</style>
