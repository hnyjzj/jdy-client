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
  --uno: 'bg-[#F5F6F9] dark:bg-[#0A113C]';
}
</style>
