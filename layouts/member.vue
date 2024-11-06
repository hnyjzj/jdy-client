<script setup lang="ts">
const company = ref(60)
</script>

<template>
  <div
    class="body min-h-screen  z-0" :style="{
      '--navbar-height': `${company}px`,
    }">
    <div
      class="min-h-screen z-2 relative">
      <div>
        <slot name="header" />
        <div class=" blur-bgc rounded-t-[16px] px-[16px]  pt-[16px]" :style="{ height: `calc(100vh - var(--navbar-height,0px))` }">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body {
  --uno: 'bg-gradient-linear-[180deg,#3875C5,#F1F5FE] dark:bg-gradient-linear-[180deg,#3875C5,#07111F]';
}
</style>
