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
  <div class="flex items-center">
    <template v-if="props.img">
      <n-image
        :src="ImageUrl(props.img)"
        class="w-full h-full shadow-[-3px_3px_0px_-1px_rgba(56,101,258,.8)]"
        :width="props.size"
        :height="props.size"
        :style="{
          borderRadius: props.rounded,
          boxShadow: props.hasShadow ? '-4 4px 0px 1px rgba(56,101,258,.8)' : 'none',
        }"
      />
    </template>
    <template v-else>
      <div
        class="rounded-[8px] bg-gray-200 shadow-[-3px_3px_0px_-1px_rgba(56,101,258,.8)]"
        :style="{
          width: `${props.size}px`,
          height: `${props.size}px`,
          borderRadius: props.rounded,
          boxShadow: props.hasShadow ? '-4 4px 0px 1px rgba(56,101,258,.8)' : 'none',
        }" />
    </template>
  </div>
</template>
