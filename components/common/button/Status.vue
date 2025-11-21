<!-- 状态按钮 -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  bgColor?: string
  color?: string
}>(), {
  bgColor: '#1A6BEB',
  color: '#FFFFFF',
})

const emits = defineEmits(['buttonClick'])
const handleClick = () => {
  emits('buttonClick')
}
</script>

<template>
  <div
    class="flex-center-row text-3 rounded-[8px] cursor-pointer flex-1 px-3 py-[2px]"
    :style="{
      color: props.color,
      background: props.bgColor,
    }"
    @click="handleClick"
  >
    {{ props.text }}
  </div>
</template>
