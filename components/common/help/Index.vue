<script setup lang="ts">
const props = defineProps<{
  /**
   * icon尺寸 传递类型为number
   * @default 20
   */
  size?: number
  /**
   * 弹出框内边距
   * @example '10px 20px 30px 40px'
   * @default '64px'
   */
  padding?: string
}>()

const showHelp = defineModel({ type: Boolean, default: false })

const handleShow = () => {
  showHelp.value = true
}

const iconSize = props.size ?? 20
</script>

<template>
  <van-popup v-model:show="showHelp" round :style="{ padding: props.padding ?? '64px' }">
    <slot />
  </van-popup>
  <div @click="handleShow">
    <icon
      name="i-icon:help" :size="iconSize" color="#333333" />
  </div>
</template>
