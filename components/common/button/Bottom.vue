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
  <div class="btn grid-12 bottom-0 sticky z-1">
    <div class="col-12" uno-lg="col-8 offset-2">
      <div class="flex flex-row gap-2">
        <button class="btn-left cursor-pointer" @click="cancel">
          {{ props.cancelText }}
        </button>
        <button class="btn-right cursor-pointer" @click="confirm">
          {{ props.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc p-[12px_16px] text-[16px] font-bold';
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
