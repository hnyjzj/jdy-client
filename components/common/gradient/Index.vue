<script setup lang="ts">
type AlignType = 'space-between' | 'start'

/**
 * theme: 系统主题色渐变
 * gradient: 渐变色
 * solid: 纯色
 */
type ThemeType = 'theme' | 'gradient' | 'solid'

const props = withDefaults(defineProps<{
  title: string
  /**
   * 左侧内容对齐方式
   */
  alignDesc?: AlignType
  /**
   * 渐变色主题
   */
  theme?: ThemeType
  /**
   * 是否斜体
   */
  italic?: boolean
  /**
   * 是否加粗
   */
  bold?: boolean
  /**
   * 是否展示折叠图标
   */
  foldable?: boolean
  /**
   * 是否有阴影
   */
  hasShadow?: boolean
  /**
   * 默认展开或折叠
   */
  isFolds?: boolean
  fontSize?: string
}>(), {
  alignDesc: 'space-between',
  theme: 'theme',
  foldable: false,
  italic: false,
  bold: true,
  textColor: '#333',
  hasShadow: false,
  isFolds: true,
  fontSize: '16px',
})

const isFold = ref(props.isFolds)

// 监听 isFolds 变化
watchEffect(() => {
  isFold.value = props.isFolds
})

const toggleFold = () => {
  isFold.value = !isFold.value
}

const themeProcess = () => {
  const themeMap = {
    gradient: 'linear-gradient(90deg,#8CADF8,#D8E7FD)',
    theme: 'linear-gradient(90deg,#477ef500,#82d0faf2)',
    solid: '#F1F5FE',
  }
  return themeMap[props.theme] || themeMap.solid
}
</script>

<template>
  <div
    class="info mb-[12px]"
    :style="{ boxShadow: props.hasShadow ? '0px 8px 16px rgba(0, 0, 0, 0.1)' : 'none' }"
  >
    <div
      class="flex flex-row items-center justify-between h-[44px] px-4 py-2 bg-gradient-linear-[90deg,#8CADF8,#D8E7FD] gap-[12px]"
      :style="{ background: themeProcess() }"
    >
      <div class="flex flex-row gap-[8px]" :style="{ justifyContent: props.alignDesc }">
        <slot name="before" />

        <div
          class="text-[16px] text-[#333] dark:text-[#FFF]"
          :style="{
            fontStyle: props.italic ? 'italic' : 'normal',
            fontWeight: props.bold ? 'bold' : 'normal',
            fontSize: props.fontSize ?? '14px',
          }"
        >
          {{ props.title }}
        </div>

        <slot name="after" />
      </div>

      <template v-if="props.foldable">
        <div class="cursor-pointer" @click="toggleFold">
          <template v-if="!isFold">
            <icon name="i-icon:arrow" />
          </template>
          <template v-else>
            <icon name="i-icon:arrow-down" size="8" />
          </template>
        </div>
      </template>

      <slot name="right" />
    </div>

    <div v-show="isFold">
      <div class="px-[16px] py-[16px] blur-bga">
        <slot name="body" />
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.info {
  --uno: 'bg-[rgba(255,255,255,0.8)] dark:bg-[rgb(245,245,245,0.1)] rounded-[24px] overflow-hidden';
}
</style>
