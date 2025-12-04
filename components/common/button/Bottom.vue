<script setup lang="ts">
interface Props {
  cancelText?: string
  confirmText?: string
  cancleColor?: string
  cancleBgc?: string
  cancleShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确认',
  cancleColor: '#3971F3',
  cancleBgc: '#ffffff',
  cancleShow: true,
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
    <div class="col-12" uno-sm="col-6 offset-3" uno-lg="col-4 offset-4" uno-xl="col-4 offset-4">
      <slot name="content">
        <div class="flex flex-row gap-2">
          <template v-if="cancleShow">
            <button
              class="btn-left cursor-pointer" :style="{
                color: props.cancleColor ? props.cancleColor : '#3971F3',
                background: props.cancleBgc ? props.cancleBgc : '#ffffff' }" @click="cancel">
              <slot name="cancel">
                {{ props.cancelText }}
              </slot>
            </button>
          </template>

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
  box-shadow: 0px -1px 15px 0px #0000001a;
  &-left {
    --uno: 'text-[16px]  bg-transparent  py-[8px] border-none flex-1 text-center rounded-[36px] mr-[8px] text-#3971f3';
    border: 1px solid #3971f3;
  }

  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>
