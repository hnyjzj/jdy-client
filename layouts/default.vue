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
  --uno: 'bg-[linear-gradient(180deg,#3875C5_0%,#3875C5_160px,#F1F5FE_100%)] dark:bg-[linear-gradient(180deg,#3875C5_0%,#3875C5_160px,#07111F_100%)]';
}
</style>
