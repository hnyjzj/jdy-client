<script setup lang="ts">
// "+"符号按钮
const props = withDefaults(defineProps<{
  /**
   * 尺寸
   */
  size?: number
  /**
   * 是否是加号
   * true: 加符号 ; false: 减符号
   */
  isAdd?: boolean
}>(), {
  size: 32,
  isAdd: true,
})

const emits = defineEmits(['buttonClick'])

const handleClick = () => {
  emits('buttonClick')
}
</script>

<template>
  <div
    class="bg-[#F1F5FE] rounded-[60px] flex justify-center items-center cursor-pointer"
    :style="`width: ${props.size}px; height: ${props.size}px;`"
    @click="handleClick"
  >
    <template v-if="props.isAdd">
      <icon name="i-icon:add" :size="20" color="#3971F3" />
    </template>
    <template v-else>
      <icon name="i-icon:subtract" :size="20" color="#3971F3" />
    </template>
  </div>
</template>

<style scoped lang="scss">
</style>
