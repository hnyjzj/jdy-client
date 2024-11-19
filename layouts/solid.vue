<script setup lang="ts">

</script>

<template>
  <div
    class="body min-h-screen  z-0">
    <div
      class="min-h-screen z-2 relative">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/css/main';

.body {
  --uno: 'bg-[#F7F7F7] dark:bg-gradient-linear-[180deg,#3875C5,#07111F]';
}
</style>
