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
  height?: string
}>(), {
  placement: 'right',
  width: '80%',
  isMaskClose: true,
  height: '400px',
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
    v-model:show="show" :auto-focus="false"
    :style="{
      '--n-color': 'transparent',
      '--n-header-padding': '0',
      '--n-header-border-bottom': 'none',
      '--n-body-padding': '0',
      '--n-footer-padding': '0',
    }" :width="props.width" :height="props.height" default-height="400px" resizable :mask-closable="isMaskClose" :placement="props.placement">
    <n-drawer-content header-class="rounded-2">
      <template #header>
        <div class="top">
          <template v-if="props.title">
            <div class="flex items-center">
              <div class="w-1 h-4 bg-[#1A6DD8] rounded-[4px] mr-2" />
              <div class="text-[16px] font-bold text-[#1A6DD8]">
                {{ props.title }}
              </div>
            </div>
          </template>
          <div class="text-color" @click="close">
            <icon name="i-icon:error" />
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
  --uno: 'min-h-full p-[16px] blur-bga';
}
.footer {
  --uno: 'block w-full blur-bga py-3';
  box-shadow: 0px -1px 15px 0px #0000001a;
}
.top {
  --uno: 'p-3 flex justify-between items-center border-rd-[20px_0_0_0] blur-bga';
}
.title-content {
  --uno: 'absolute left-24 top-6 z-3 text-#fff font-bold';
  transform: skewY(-4deg);
  transform-origin: bottom left;
}
</style>
