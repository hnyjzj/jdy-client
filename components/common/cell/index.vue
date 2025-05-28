<script lang="ts" setup>
const props = withDefaults(defineProps<{
  label: string | number
  value?: string | number | boolean
  valColor?: string
  labelColor?: string
  format?: string
  right?: string
  rcol?: string
  lcol?: string
}>(), {
  rcol: 'col-6',
  lcol: 'col-6',
  value: '-',
})
</script>

<template>
  <div class="part pb-[8px]">
    <div class="part-left break-words " :class="[props.lcol ? props.lcol : 'col-6']">
      <template v-if="props.labelColor">
        <div :style="{ color: props.labelColor }" class="dark:color-[#fff]">
          {{ props.label }}
        </div>
      </template>
      <template v-else>
        <div class="dark:color-[#fff]">
          {{ props.label }}
        </div>
      </template>
    </div>
    <div class="part-right break-words" :class="[props.rcol ? props.rcol : 'col-6']" :style="{ color: props.valColor }">
      <template v-if="props.valColor">
        {{ props.format ? props.format : '' }} {{ typeof props.value === 'boolean' ? props.value ? '是' : '否' : props.value === '' ? '-' : props.value }}  {{ props.right ? props.right : '' }}
      </template>
      <template v-else>
        <div class="dark:color-[#fff]">
          {{ props.format ? props.format : '' }} {{ typeof props.value === 'boolean' ? props.value ? '是' : '否' : props.value === '' ? '-' : props.value }}  {{ props.right ? props.right : '' }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .part {
  --uno: 'grid-12';
  &-left {
    --uno: ' text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
  }
  &-right {
    --uno: 'text-size-[14px] text-end color-[#333] dark:color-[#fff]';
    white-space: wrap;
  }
}
</style>
