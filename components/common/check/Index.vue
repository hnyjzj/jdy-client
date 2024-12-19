<script setup lang="ts">
// 勾选框
const props = withDefaults(defineProps<{
  /**
   * 圆角大小
   */
  rounded?: string
  /**
   * 尺寸
   */
  size?: string
}>(), {
  rounded: '60px',
  size: '20px',
})
const checked = defineModel({ type: Boolean, default: false })

function toggleCheck() {
  checked.value = !checked.value
}
</script>

<template>
  <div class="cursor-pointer" @click="toggleCheck">
    <template v-if="checked">
      <div class="check-box" :style="{ borderRadius: props.rounded, width: props.size, height: props.size }">
        <icon name="i-icon:check-box" color="#3971F3" :size="props.size" />
      </div>
    </template>
    <template v-else>
      <div class="border-solid border-2 border-[#CBCDD1]" :style="{ borderRadius: props.rounded, width: props.size, height: props.size }" />
    </template>
  </div>
</template>

<style scoped>
.check-box {
  --uno: 'flex-row justify-center items-center border-solid border-2 border-[#3971F3] bg-[#fff]';
}
</style>
