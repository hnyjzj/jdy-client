<!-- 圆角蓝色按钮 -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  content: string
  color?: string
  shadow?: boolean
  padding?: string
  bgc?: string
  margin?: string
}>(), {
  color: '',
  padding: '',
  margin: '0',
})

const emits = defineEmits(['buttonClick'])
const handleClick = () => {
  emits('buttonClick')
}
</script>

<template>
  <div>
    <div
      class="flex-center-row font-bold text-3 rounded-3xl cursor-pointer flex-1"
      :style="{
        color: props.color ? props.color : '#fff',
        background: props.bgc ? props.bgc : 'linear-gradient(#1A6BEB, #6EA6FF)',
        padding: props.padding ? props.padding : '8px 16px',
        margin: props.margin,
      }"
      @click="handleClick"
    >
      {{ props.content }}
    </div>
  </div>
</template>
