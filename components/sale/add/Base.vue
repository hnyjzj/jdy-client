<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
}>(), {
  title: '基础信息',
})
</script>

<template>
  <common-fold :title="props.title" :is-collapse="false">
    <div class="p-[16px] w-auto flex flex-col gap-[12px]" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
      <slot />
    </div>
  </common-fold>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col gap-[8px]';

  .inplabel {
    --uno: 'color-[#333] dark:text-[#FFFFFF] font-size-[14px]';
  }
}
</style>
