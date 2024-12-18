<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  radius?: string
}>(), {

  radius: '24px',
})

const emits = defineEmits(['submit'])

function submit() {
  emits('submit')
}
</script>

<template>
  <div class="editbox cursor-pointer" :style="{ '--br-br': props.radius }" @click="submit">
    <div
      class="text ">
      <span v-text="props.text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editbox {
  --uno: 'relative z-0';
  .text {
    --uno: 'relative px-[40px] py-[9px] z-2 color-[#fff] text-sm text-nowrap';
  }
  &::before {
    content: '';
    --uno: 'absolute bottom-[0] w-[80%] h-[100%] bg-#DEDEDE bg-gradient-linear-[180deg,#1F6FEC,#68A2FE] skew-x-320 rounded-rb-8px  rounded-tl-[6px] rounded-bl-[15px] z-1 ';
  }

  &::after {
    content: '';
    --uno: 'absolute bottom-[0] right-0 w-[80%] h-[100%] bg-#DEDEDE bg-gradient-linear-[180deg,#1F6FEC,#68A2FE] rounded-tr-8px rounded-tl-[6px] rounded-bl-[15px]  z-1 ';
    border-bottom-right-radius: var(--br-br);
  }
}
</style>
