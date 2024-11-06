<script setup lang="ts">
const props = defineProps<{
  name: string
  color?: string
  size?: string | number
}>()

const attrs = useAttrs()
</script>

<template>
  <div
    class="icon"
    v-bind="attrs"
    :style="{
      '--color': props.color,
      '--size': props.size ? `${props.size}px` : '16px',
    }">
    <div :class="props.name" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: var(--size);
  color: var(--color);
}
</style>
