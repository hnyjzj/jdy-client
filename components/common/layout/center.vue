<script lang="ts" setup>

</script>

<template>
  <div class="lc">
    <div class="center">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lc {
  --uno: 'sm:grid-12';
  .center {
    --uno: 'sm:col-10 sm:offset-1 md:col-8 md:offset-2';
  }
}
</style>
