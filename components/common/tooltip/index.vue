<script setup lang="ts">
const props = defineProps<{
  val: any
}>()
</script>

<template>
  <n-tooltip v-if="props.val" placement="bottom" trigger="click">
    <template #trigger>
      <div class="ellipsis-value cursor-pointer">
        {{ props.val || '--' }}
      </div>
    </template>
    <span>{{ props.val || '--' }}</span>
  </n-tooltip>
</template>

<style scoped>
.ellipsis-value {
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 隐藏超出 */
  text-overflow: ellipsis; /* 省略号 */
}
</style>
