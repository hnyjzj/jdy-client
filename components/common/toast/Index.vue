<script setup lang="ts">
import type { Toast, ToastIcons, ToastStyles } from './type'

const props = withDefaults(defineProps<Toast>(), {
  type: 'primary',
  duration: 3000,
})
const THEME: ToastStyles = {
  error: {
    backgroundColor: '#FFEDED',
    color: '#FF2F2F',
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
const ICON: ToastIcons = {
  success: 'i-icon:success',
  error: 'i-icon:error',
  warning: 'i-icon:warning',
  primary: 'i-icon:help',
}

const icon = ref(props.icon || ICON[props.type])
const style = ref(THEME[props.type])

const isLeaving = ref(false)
const timer = ref<NodeJS.Timeout>()

onMounted(() => {
  timer.value = setTimeout(() => {
    isLeaving.value = true
  }, props.duration)
})

onUnmounted(() => {
  clearTimeout(timer.value)
})
</script>

<template>
  <div
    class="toast"
    :class="{ 'fade-out': isLeaving }"
    :style="{ backgroundColor: style.backgroundColor }"
  >
    <div
      class="content"
      uno-lg="flex-center-row"
    >
      <div class="icon-box">
        <div class="icon" :style="{ backgroundColor: style.iconBg }">
          <div class="color-[#fff]" :class="[icon]" />
        </div>
      </div>
      <div class="msg" :style="{ color: style.color }">
        {{ props.message }}
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
