<script setup lang="ts">
const props = withDefaults(defineProps<{
  /**
   * 尺寸
   */
  size: number
  /**
   * 图片地址
   */
  img?: string
  /**
   * 圆角大小
   */
  rounded?: string
  /**
   * 是否有投影
   */
  hasShadow?: boolean
}>(), {
  img: '',
  rounded: '8px',
  hasShadow: true,
})
</script>

<template>
  <div>
    <template v-if="props.img">
      <img
        :src="props.img"
        class="w-full h-full shadow-[-4px_4px_0px_1px_rgba(56,101,258,.8)]"
        :style="{
          width: `${props.size}px`,
          height: `${props.size}px`,
          borderRadius: props.rounded,
          boxShadow: props.hasShadow ? '-4 4px 0px 1px rgba(56,101,258,.8)' : 'none',
        }"
      >
    </template>
    <template v-else>
      <div
        class="rounded-[8px] bg-gray-200 shadow-[-4px_4px_0px_1px_rgba(56,101,258,.8)]"
        :style="{
          width: `${props.size}px`,
          height: `${props.size}px`,
          borderRadius: props.rounded,
          boxShadow: props.hasShadow ? '-4 4px 0px 1px rgba(56,101,258,.8)' : 'none',
        }" />
    </template>
  </div>
</template>
