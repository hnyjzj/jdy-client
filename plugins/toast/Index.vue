<script setup lang="ts">
interface Props {
  /**
   * 文本内容
   */
  msg: string
  /**
   * 提示主题
   * 'error' | 'warning' | 'success' | 'primary'
   */
  type?: types
  /**
   * 显示时长
   */
  duration?: number
  /**
   * icon
   */
  ico?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  duration: 3000,
  ico: 'i-icon:success',
})

type Toasts = {
  backgroundColor?: string
  color?: string
  iconBg?: string
} & Partial<Props>

type types =
  | 'error'
  | 'warning'
  | 'success'
  | 'primary'

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
  <div class="toast-container">
    <div class="rounded-[8px] w-80%" :style="{ backgroundColor: toastStyle[props.type].backgroundColor }">
      <div
        class="flex flex-row items-center gap-[12px] px-[12px] py-[12px]"
        uno-lg="flex-center-row w-60%"
      >
        <div class="icon">
          <div class="rounded-[4px] w-[24px] h-[24px] text-lg flex-center-row" :style="{ backgroundColor: toastStyle[props.type].iconBg }">
            <div class="color-[#fff]" :class="[props.ico || 'i-icon:succeed']" />
          </div>
        </div>
        <div class="msg font-medium font-size-[14px]" :style="{ color: toastStyle[props.type].color }">
          {{ props.msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast-container {
  --uno: 'fixed left-10% right-0 top-10% bottom-0 w-[100vw] h-[100vh] z-999 overflow-hidden';
}
</style>
