<script setup lang="ts">
interface Props {
  cancelText?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确认',
})
const emit = defineEmits(['cancel', 'confirm'])

const cancel = () => {
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <div class="grid-12 btn">
    <div class="col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <slot name="content">
        <div class="flex flex-row gap-2">
          <button class="btn-left cursor-pointer" @click="cancel">
            <slot name="cancel">
              {{ props.cancelText }}
            </slot>
          </button>
          <button class="btn-right cursor-pointer" @click="confirm">
            <slot name="confirm">
              {{ props.confirmText }}
            </slot>
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc p-[12px_16px] text-[16px] font-bold ';
  border-top: rgba(230, 230, 232, 1) solid 1px;
  &-left {
    background: #ffffff;
    box-shadow: 0px 6px 6px rgba(110, 166, 255, 0.3);
    --uno: 'text-[16px] text-[#3971F3] py-[8px] border-none flex-1 text-center rounded-[36px] mr-[8px]';
  }

  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>
