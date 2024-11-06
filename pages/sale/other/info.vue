<script setup lang="ts">
// 收支单详情页
useSeoMeta({
  title: '收支单',
})
// TODO: 未携参则展示空页面
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <sale-other-info />
      <div class="h-[80px]">
        <common-button-bottom confirm-text="确定" cancel-text="取消" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
