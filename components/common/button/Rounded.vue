<!-- 圆角蓝色按钮 -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  content: string
  color?: string
  shadow?: boolean
  padding?: string
  bgc?: string
  margin?: string
  full?: boolean
  border?: string
  size?: string
  isBlod?: boolean
}>(), {
  color: '',
  padding: '',
  margin: '0',
  full: false,
  size: '14px',
  isBlod: true,
})

const emits = defineEmits(['buttonClick'])
const handleClick = () => {
  emits('buttonClick')
}
</script>

<template>
  <div :style="props.full ? 'flex:1;' : ''">
    <div
      class="flex-center-row  rounded-3xl cursor-pointer flex-1 box-border"
      :style="{
        color: props.color ? props.color : '#fff',
        background: props.bgc ? props.bgc : 'linear-gradient(#1A6BEB, #6EA6FF)',
        padding: props.padding ? props.padding : '8px 16px',
        margin: props.margin,
        border: props.border,
        fontSize: props.size,
        fontWeight: props.isBlod ? 'bold' : 'normal',
      }"
      @click="handleClick"
    >
      {{ props.content }}
    </div>
  </div>
</template>
