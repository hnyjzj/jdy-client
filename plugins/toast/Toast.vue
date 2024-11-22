<script setup lang="ts">
interface ToastOptions extends Toast {
  id: string
}

const props = defineProps<{
  instance: ToastOptions
}>()

type Toasts = {
  backgroundColor?: string
  color?: string
  iconBg?: string
} & Partial<Toast>

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

const data = props.instance

const isLeaving = ref(false)

const DEFAULT_DURATION = 2000
const ANIMATION_DURATION = 1000

const countdown = data.duration ? data.duration - ANIMATION_DURATION : DEFAULT_DURATION

onMounted(() => {
  setTimeout(() => {
    isLeaving.value = true
  }, countdown)
})
</script>

<template>
  <div
    :key="data.id"
    class="toast"
    :class="{ 'fade-out': isLeaving }"
    :style="{ backgroundColor: toastStyle[data.theme || 'primary'].backgroundColor }"
  >
    <div
      class="content"
      uno-lg="flex-center-row"
    >
      <div class="icon-box">
        <div class="icon" :style="{ backgroundColor: toastStyle[data.theme || 'primary'].iconBg }">
          <div class="color-[#fff]" :class="[data.icon || 'i-icon:success']" />
        </div>
      </div>
      <div class="msg" :style="{ color: toastStyle[data.theme || 'primary'].color }">
        {{ data.message }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.toast {
  --uno: 'rounded-[8px] p-0 blur-bga shadow-[0px_6px_24px_-9px_rgba(0,0,0,.1)]';
  animation: slide-in 0.3s ease-out;

  &.fade-out {
    animation: fade-out 0.3s ease-out forwards;
  }

  .content {
    --uno: 'flex flex-row items-center gap-[12px] px-[12px] py-[12px]';

    .icon-box {
      .icon {
        --uno: 'rounded-[4px] w-[24px] h-[24px] text-lg flex-center-row';
      }

      .msg {
        --uno: 'font-medium font-size-[14px]';
      }
    }
  }
}
</style>
