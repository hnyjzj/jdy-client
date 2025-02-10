<script lang="ts" setup>
const props = withDefaults(defineProps<{
  /**
   * 弹出层方向
   */
  placement?: 'left' | 'right' | 'top' | 'bottom'
  /**
   * 弹出层宽度
   */
  width?: string
  /**
   * 弹出层标题
   */
  title?: string
  /**
   * 是否点击遮罩层关闭
   */
  isMaskClose?: boolean
}>(), {
  placement: 'right',
  width: '80%',
  isMaskClose: true,
})

const emits = defineEmits<{
  close: []
}>()
const show = defineModel({ type: Boolean, default: false })

function close() {
  show.value = false
  emits('close')
}
</script>

<template>
  <n-drawer
    v-model:show="show" :style="{
      '--n-color': 'transparent',
      '--n-header-padding': '0',
      '--n-header-border-bottom': 'none',
      '--n-body-padding': '0',
      '--n-footer-padding': '0',
    }" :width="props.width" default-height="400px" resizable :mask-closable="isMaskClose" :placement="props.placement">
    <n-drawer-content header-class="rounded-2">
      <template #header>
        <template v-if="props.title">
          <div class="title relative mb-[-36px]">
            <img class="relative z-2" src="/images/model/title1.png" width="80">
            <img class="ml--10 mb-1 relative z-1" src="/images/model/title2.png" width="170">
            <div class="title-content">
              {{ props.title }}
            </div>
          </div>
        </template>
        <div class="top">
          <div class="close" @click="close">
            <van-icon name="cross" color="#fff" size="16" />
          </div>
        </div>
      </template>
      <div class="content">
        <slot name="default" />
      </div>
      <template #footer>
        <template v-if="$slots.footer">
          <div class="footer">
            <slot name="footer" />
          </div>
        </template>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
.content {
  --uno: 'min-h-full  p-[16px] bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px';
}
.footer {
  border-top: 1px solid #e6e6e8;
  --uno: 'block w-full bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px py-3';
}
.top {
  --uno: 'flex justify-end items-center h-34px border-rd-[20px_20px_0_0]';
  background: linear-gradient(to right, rgba(147, 211, 245, 1), rgba(56, 101, 252, 1));
  .close {
    --uno: 'mr-[20px]';
  }
}
.title-content {
  --uno: 'absolute left-20 top-6 z-3 text-#fff font-bold';
  transform: skewY(-4deg);
  transform-origin: bottom left;
}
</style>
