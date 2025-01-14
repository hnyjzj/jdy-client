<script setup lang="ts">
interface Props {
  text: string
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
  <div class="bottom grid-12">
    <button class="btn offset-2 col-span-8 cursor-pointer" @click="confirm">
      {{ props.text }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.bottom {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga p-[12px_16px] text-[16px] font-bold';

  .btn {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] text-[#FFFFFF]';
  }
}
</style>
