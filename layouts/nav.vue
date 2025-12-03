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
  position: relative;
  --uno: 'bg-[#F4F9FD] dark:bg-[#0A113C]';
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 180px;
    top: 0;
    left: 0;
    // border-radius: 0 0 22% 22%;
    // transform: translateX(-10%);

    background-color: #3875c5;

    clip-path: polygon(
      100% 0%,
      0% 0%,
      0% 88.596%,
      0% 88.596%,
      4.443% 90.673%,
      9.032% 92.56%,
      13.758% 94.249%,
      18.614% 95.735%,
      23.59% 97.011%,
      28.679% 98.069%,
      33.873% 98.904%,
      39.163% 99.508%,
      44.541% 99.876%,
      50% 100%,
      50% 100%,
      55.459% 99.876%,
      60.837% 99.508%,
      66.127% 98.904%,
      71.321% 98.069%,
      76.41% 97.011%,
      81.386% 95.735%,
      86.242% 94.249%,
      90.968% 92.56%,
      95.557% 90.673%,
      100% 88.596%,
      100% 0%
    );
  }
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 180px;
    top: -14px;
    right: 0;
    background-image: url('@/assets/icons/index-six.svg');
    background-repeat: no-repeat;
    background-position: right;
    z-index: 1;
  }
}
</style>
