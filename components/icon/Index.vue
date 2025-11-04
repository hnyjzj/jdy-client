<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  dark?: `dark:${string}`
  color?: string
  size?: number | string
  position?: string
}>(), {
  color: 'currentColor',
  size: 16,
  position: 'center',
})

const attrs = useAttrs()
</script>

<template>
  <div
    class="icon" v-bind="attrs"
    :style="{
      '--color': props.color,
      '--size': props.size ? `${props.size}px` : '16px',
      'justify-content': props.position,
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
