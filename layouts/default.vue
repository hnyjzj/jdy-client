<script setup lang="ts">

</script>

<template>
  <div
    class="body min-h-screen z-0">
    <div
      class="min-h-screen z-2 relative">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/css/main';

.body {
  --uno: 'bg-[#F4F9FD] dark:bg-[#1D2C60]';
}
</style>
