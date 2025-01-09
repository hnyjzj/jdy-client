<script setup lang="ts">
const props = withDefaults(defineProps<{
  content: string
  color?: string
  shadow?: boolean
  padding?: string
  bgc?: string
}>(), {
  color: '',
  padding: '',
  shadow: true,
})

const emits = defineEmits(['buttonClick'])
const handleClick = () => {
  emits('buttonClick')
}
</script>

<template>
  <div
    class="flex-center-row font-bold text-4 rounded-3xl cursor-pointer"
    :style="{
      color: props.color ? props.color : '#fff',
      background: props.bgc ? props.bgc : 'linear-gradient(0deg, #6ea6ffbf 11%, #1a6beb)',
      boxShadow: props.shadow ? '0px 5px 10px 0px rgba(57, 113, 243, 0.24)' : '',
      padding: props.padding ? props.padding : '8px 16px',
    }"
    @click="handleClick"
  >
    {{ props.content }}
  </div>
</template>
