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
  <div class="cursor-pointer">
    <n-modal v-model:show="showHelp" :style="{ margin: props.padding ?? '24px' }" :bordered="false" :segmented="false">
      <div class="bg-white rounded-lg w-[400px] p-4">
        <slot />
      </div>
    </n-modal>
    <div @click="handleShow">
      <icon
        name="i-icon:help" :size="iconSize" color="#333333" />
    </div>
  </div>
</template>
