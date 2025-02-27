<script setup lang="ts">
useSeoMeta({
  title: '待办',
})
</script>

<template>
  <div class="grid-12 pb-[120px]!">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <img src="/images/banner/work.png" class="w-[200px]">
      </div>
      <home-greet />
      <common-dark />
      <home-store />
      <home-boss />
      <home-action />
      <home-sale />
      <home-inventory />
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>
