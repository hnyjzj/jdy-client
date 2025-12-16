<script setup lang="ts">
import type { Placement } from 'naive-ui/es/drawer/src/DrawerBodyWrapper'

const props = withDefaults(defineProps<{
  val: any
  placement?: Placement
}>(), {
  placement: 'bottom',
})
</script>

<template>
  <n-tooltip v-if="props.val" :placement="props.placement" trigger="click">
    <template #trigger>
      <div class="ellipsis-value cursor-pointer">
        {{ props.val }}
      </div>
    </template>
    <span>{{ props.val }}</span>
  </n-tooltip>
</template>

<style scoped>
.ellipsis-value {
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 隐藏超出 */
  text-overflow: ellipsis; /* 省略号 */
}
</style>
