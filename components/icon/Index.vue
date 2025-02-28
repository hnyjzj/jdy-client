<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  dark?: `dark:${string}`
  color?: string
  size?: number | string
}>(), {
  color: 'currentColor',
  size: 16,
})

const attrs = useAttrs()
</script>

<template>
  <div
    class="icon" v-bind="attrs"
    :style="{
      '--color': props.color,
      '--size': props.size ? `${props.size}px` : '16px',
    }">
    <div
      :class="[props.name, props.dark]" class="i" v-bind="attrs" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  --uno: 'flex-center-row';

  .i {
    font-size: var(--size);
    color: var(--color);
  }
}
</style>
