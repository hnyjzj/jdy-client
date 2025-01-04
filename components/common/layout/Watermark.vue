<script lang="ts" setup>
import type { WatermarkProps } from 'naive-ui'

// 用户信息
const { userinfo } = storeToRefs(useUser())
// 水印信息
const watermark = ref<WatermarkProps>()
onMounted(() => {
  watermark.value = {
    content: userinfo.value?.nickname + userinfo.value?.phone || undefined,
    fontColor: 'rgba(128, 128, 128, .2)',
    selectable: false,
    fontSize: 14,
    lineHeight: 16,
    width: 400,
    height: 100,
    xOffset: 100,
    yOffset: 80,
    rotate: -15,
    xGap: 100,
    yGap: 80,
    zIndex: 1,
  }
})
</script>

<template>
  <n-watermark v-bind="watermark">
    <slot />
  </n-watermark>
</template>

<style lang="scss" scoped>

</style>
