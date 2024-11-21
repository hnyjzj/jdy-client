<script setup lang="ts">
import Specific from './Toast.vue'

interface ToastOptions extends Props {
  id: string
}

const props = defineProps<{
  instances: ToastOptions[]
}>()

const insData = props.instances[0]

const offset = insData.colStart && insData.colSpan ? insData.colStart + insData.colSpan : 11
</script>

<template>
  <div class="toast-container">
    <template v-for="instance in props.instances" :key="instance.id">
      <div
        class="toast-item"
        :style="{
          gridColumnStart: instance.colStart || 3,
          gridColumnEnd: offset,
        }"
      >
        <Specific :instance="instance" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.toast-container {
  --uno: 'fixed bottom-auto w-[100vw] h-auto z-999 grid-12 top-[10%]';
}
</style>
