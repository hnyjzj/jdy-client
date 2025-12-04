<script setup lang="ts">
interface Props {
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '确认',
})
const emit = defineEmits(['confirm'])

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <div class="bottom">
    <common-layout-center>
      <button class="btn cursor-pointer w-[100%]" @click="confirm">
        {{ props.text }}
      </button>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
.bottom {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga p-[12px_16px] text-[16px] font-bold';
  box-shadow: 0px -1px 15px 0px #0000001a;

  .btn {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] text-[#FFFFFF]';
  }
}
</style>
