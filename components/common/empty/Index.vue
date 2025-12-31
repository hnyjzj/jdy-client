<script setup lang="ts">
const props = withDefaults(defineProps<{
  text?: string
}>(), {
  text: '暂无数据~',
})
</script>

<template>
  <div class="flex flex-col justify-center items-center py-[16px]">
    <div class="empty">
      <template v-if="$slots.icon">
        <slot name="icon" />
      </template>
      <template v-else>
        <icon
          name="i-svg:empty-list"
          size="128"
        />
      </template>
    </div>
    <template v-if="props.text">
      <div class="font-size-[14px] color-[#606266] pt-[8px]">
        {{ props.text }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  --uno: 'rounded-[50%] relative';
}
</style>
