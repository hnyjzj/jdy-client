<script setup lang="ts">
type types =
  | 'error'
  | 'warning'
  | 'success'
  | 'primary'

interface Props {
  /**
   * 文本内容
   */
  message: string
  /**
   * 提示主题
   * 'error' | 'warning' | 'success' | 'primary'
   */
  theme?: types
  /**
   * 显示时长
   */
  duration?: number
  /**
   * icon
   */
  icon?: string
  /**
   * 网格列开始
   */
  colStart?: number
  /**
   * 网格列跨度
   */
  colSpan?: number
  /**
   * 距顶部距离
   * @param {number} top - 元素的垂直位置，单位为百分比（%）
   */
  top?: number
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'primary',
  duration: 3000,
  icon: 'i-icon:success',
  colStart: 3,
  colSpan: 8,
  top: 10,
})

type Toasts = {
  backgroundColor?: string
  color?: string
  iconBg?: string
} & Partial<Props>

const toastStyle: { [key in types]: Toasts } = {
  error: {
    // 标签背景色
    backgroundColor: '#FFEDED',
    // 标签字体色
    color: '#FF2F2F',
    // 图标背景色
    iconBg: '#FF2F2F',
  },
  warning: {
    backgroundColor: '#F6EFE3',
    color: '#FFB931',
    iconBg: 'rgb(255, 170, 4, 0.8)',
  },
  success: {
    backgroundColor: '#EFF4F2',
    color: '#106633',
    iconBg: 'rgb(0, 205, 45, 0.8)',
  },
  primary: {
    backgroundColor: '#F1F5FE',
    color: '#2E74FF',
    iconBg: 'rgb(0, 85, 255, 0.8)',
  },
}
</script>

<template>
  <div
    class="fixed bottom-auto w-[100vw] h-auto z-999 overflow-hidden grid-12"
    :style="{ top: `${props.top}%` }"
  >
    <div
      class="rounded-[8px] p-0"
      :style="{
        backgroundColor: toastStyle[props.theme].backgroundColor,
        gridColumnStart: props.colStart,
        gridColumnEnd: props.colStart + props.colSpan,
      }"
    >
      <div
        class="flex flex-row items-center gap-[12px] px-[12px] py-[12px]"
        uno-lg="flex-center-row"
      >
        <div class="icon">
          <div class="rounded-[4px] w-[24px] h-[24px] text-lg flex-center-row" :style="{ backgroundColor: toastStyle[props.theme].iconBg }">
            <div class="color-[#fff]" :class="[props.icon || 'i-icon:succeed']" />
          </div>
        </div>
        <div class="msg font-medium font-size-[14px]" :style="{ color: toastStyle[props.theme].color }">
          {{ props.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
