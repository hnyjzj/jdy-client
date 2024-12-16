<script lang="ts" setup>
const props = withDefaults(defineProps<{
  span?: number
  gutter?: number
}>(), {
  span: 12,
  gutter: 16,
})
</script>

<template>
  <div
    class="grids" :style="{
      '--span': props.span,
      '--gutter': `${props.gutter}px`,
    }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.grids {
  display: grid;
  grid-template-columns: repeat(var(--span), minmax(0, 1fr));
  gap: var(--gutter);
}
</style>
