<script lang="ts" setup>
import type { WatermarkProps } from 'naive-ui'

// 用户信息
const { userinfo } = storeToRefs(useUser())
// 水印信息
const watermark = ref<WatermarkProps | undefined>(undefined)
onMounted(async () => {
  await nextTick()
  watermark.value = {
    content: `${userinfo.value?.nickname}\n${userinfo.value?.phone}` || undefined,
    selectable: false,
    fontSize: 14,
    lineHeight: 16,
    width: 200,
    height: 200,
    xOffset: 16,
    yOffset: 6,
    rotate: 16,
    xGap: 20,
    yGap: 20,
    zIndex: 1,
    textAlign: 'center',
    cross: true,
  }
})
</script>

<template>
  <div class="">
    <template v-if="watermark">
      <n-watermark v-bind="watermark">
        <slot />
      </n-watermark>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
