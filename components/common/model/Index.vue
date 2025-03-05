<script setup lang="ts">
interface Props {
  title?: string
  showOk?: boolean
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  showOk: false,
  showCancel: true,
  confirmText: '确定',
  cancelText: '取消',
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
watch(show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'// 禁止滚动
  }
  else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div v-if="show" class="popup">
    <div class="content">
      <div class="top">
        <div class="close" @click="close">
          <van-icon name="cross" color="#fff" size="16" />
        </div>
        <div class="title">
          <img class="title-img1" src="/images/model/title1.png" width="80">
          <img class="title-img2" src="/images/model/title2.png" width="170">
          <div class="title-content">
            {{ props.title }}
          </div>
        </div>
      </div>
      <div class="center">
        <div class="box">
          <slot />
          <div class="flex-between">
            <template v-if="props.showCancel">
              <div class="cursor-pointer" :class="[props.showOk ? 'cancel-btn' : 'ok']" :style="{ marginRight: props.showOk ? '10px' : '0' }" @click="close">
                {{ props.cancelText }}
              </div>
            </template>
            <template v-if="showOk">
              <div class="ok cursor-pointer" @click="emits('confirm')">
                {{ props.confirmText }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  --uno: 'fixed left-0 right-0 bottom-0 w-[100vw] h-[100vh] z-999 overflow-hidden';
  background: rgba($color: #000, $alpha: 0.3);
  top: calc(0 - var(--navbar-height, 0px));

  .center {
    background: linear-gradient(to bottom, rgba(147, 211, 245, 1), transparent);
    // margin-top: -2px;
  }

  .content {
    --uno: 'fixed left-0 right-0 bottom-0 sm:w-426px sm:translate-x-[-50%] sm:translate-y-[50%] sm:bottom-[50%] sm:left-[50%]';

    .top {
      --uno: 'relative h-34px border-rd-[20px_20px_0_0]';
      background: linear-gradient(to right, rgba(147, 211, 245, 1), rgba(56, 101, 252, 1));

      .close {
        --uno: 'absolute top-[10px] right-[20px] cursor-pointer';
      }

      .title {
        &-img1 {
          --uno: 'absolute bottom-0 z-[3]';
        }

        &-img2 {
          --uno: 'z-[2] pl-[58px] absolute bottom-4px';
        }

        &-content {
          --uno: 'absolute left-[80px] top-[2px] z-[9] text-[rgba(255,255,255,1)] font-bold';
          transform: skewY(-6deg);
          transform-origin: bottom left;
        }
      }
    }

    .box {
      --uno: 'border-rd-[16px_0_0_0] dark:bg-[rgba(0,0,0,0.8)] sm:border-rd-[16px_0_16px_16px] px-[16px] py-[30px] bg-[#F1F5FE]';
      margin-top: 0;
      .ok {
        --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#fff] font-bold ';
        background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
        box-shadow: rgba(57, 113, 243, 0.24) 0px 8px 8px 0;
      }
      .cancel-btn {
        --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#1a6beb] font-bold';
        background: #fff;
        box-shadow: rgba(82, 130, 241, 0.24) 0px 8px 8px 0;
      }
    }
  }
}
</style>
