<script lang="ts" setup>
//  正式站
const emit = defineEmits<{
  onWxworkLogin: []
}>()
</script>

<template>
  <div class="flex flex-col items-center py-[80px]">
    <icon name="i-svg:qwicon" :size="60" @click="emit('onWxworkLogin')" />
    <div
      class="text-[18px] line-height-[24px] pt-[16px] text-color">
      企业微信授权登录
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
