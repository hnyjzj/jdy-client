<script lang="ts" setup>
const props = withDefaults(defineProps<{
  label: string
  value?: string | number
  valColor?: string
  labelColor?: string
}>(), {
  valColor: 'black',
  labelColor: 'black',
})
</script>

<template>
  <div class="part">
    <div class="part-left break-words" :style="{ color: props.labelColor }">
      {{ props.label }}
    </div>
    <div class="part-right break-words" :style="{ color: props.valColor }">
      {{ props.value }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .part {
  --uno: ' grid-12';
  &-left {
    --uno: ' text-size-[14px] color-[#666] dark:color-[#CBCDD1] col-6';
  }
  &-right {
    --uno: 'text-size-[14px] text-end color-[#333] dark:color-[#fff] col-6';
    white-space: wrap;
  }
}
</style>
