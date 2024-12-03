<script setup lang="ts">
// 方形按钮组件
const props = withDefaults(defineProps<{
  text: string
  isFull?: boolean
}>(), {
  isFull: false,
})

const emits = defineEmits(['onButtonClick'])
const handleClick = () => {
  emits('onButtonClick')
}

const colorStyle = props.isFull ? '#0068FF' : '#fff'
</script>

<template>
  <div
    class="flex justify-center items-center px-3 py-0/.75 rounded-1 text-sm cursor-pointer"
    :style="{ backgroundColor: colorStyle, border: props.isFull === true ? 'none' : '1px solid #0068FF', color: props.isFull === true ? '#fff' : '#0068FF' }"
    @click="handleClick"
  >
    {{ props.text }}
  </div>
</template>
