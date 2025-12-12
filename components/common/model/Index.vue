<script setup lang="ts">
interface Props {
  title?: string
  showOk?: boolean
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  /**
   * 是否点击遮罩层关闭
   */
  isMaskClose?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  showOk: false,
  showCancel: true,
  confirmText: '确定',
  cancelText: '取消',
  isMaskClose: false,
})
const emits = defineEmits<{
  confirm: []
  cancel: []
}>()
const show = defineModel({ type: Boolean, default: false })

function close() {
  show.value = false
  emits('cancel')
}

/**
 * 点击遮罩层是否关闭
 */
function handleClick(event: MouseEvent) {
  if (!props.isMaskClose)
    return
  if (event.target === event.currentTarget) {
    close()
  }
}

watch(show, (val) => {
  document.documentElement.style.overflow = val ? 'hidden' : ''
})

/** 销毁时 */
onBeforeUnmount (() => {
  show.value = false
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div v-if="show" class="popup" @click="handleClick">
    <div class="content border-rd-[12px_12px_0_0] sm:rounded-[12px] blur-bgc">
      <div class="flex justify-between items-center p-4">
        <div class="flex items-center">
          <div class="w-1 h-4 bg-[#1A6DD8] rounded-[4px] mr-2" />
          <div class="text-[16px] font-bold text-[#1A6DD8]">
            {{ props.title }}
          </div>
        </div>
        <div class="close text-color" @click="close">
          <icon name="i-icon:error" />
        </div>
      </div>
      <div class="center px-4">
        <div class="box">
          <slot />
        </div>
      </div>
      <div class="bottom">
        <slot name="footer">
          <div v-if="props.showCancel || props.showOk" class="bottom-fun">
            <template v-if="props.showCancel">
              <div
                class="cursor-pointer"
                :class="[props.showOk ? 'cancel-btn' : 'ok']"
                :style="{ marginRight: props.showOk ? '10px' : '0' }"
                @click="close"
              >
                {{ props.cancelText }}
              </div>
            </template>
            <template v-if="props.showOk">
              <div class="ok cursor-pointer" @click="emits('confirm')">
                {{ props.confirmText }}
              </div>
            </template>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  --uno: 'fixed left-0 right-0 bottom-0 w-[100vw] h-[100vh] z-999';
  background: rgba($color: #000, $alpha: 0.5);
  top: calc(0 - var(--navbar-height, 0px));

  .content {
    --uno: 'fixed left-0 right-0 bottom-0 sm:w-426px sm:translate-x-[-50%] sm:translate-y-[50%] sm:bottom-[50%] sm:left-[50%] ';
  }
}
.ok {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#fff] font-bold ';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.bottom-fun {
  --uno: 'flex-between';
}
.cancel-btn {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#1a6beb] font-bold dark:bg-#ededed dark:border-none';
  border: 1px solid #3971f3;
}

.bottom {
  --uno: 'px-4 py-3';
  box-shadow: 0px -1px 15px 0px #0000001a;
}
</style>
