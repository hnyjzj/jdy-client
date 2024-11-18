<script setup lang="ts">
import { depositList } from '~/types/test'

useSeoMeta({
  title: '维修单列表',
})

// 测试数据。待替换
const list = depositList

const handleClick = async () => {
// 跳转到维修单详情页
  await navigateTo('/sale/repair/info')
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- header -->
      <!-- 搜索 -->
      <div class="flex flex-row gap-[12px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- content -->
      <sale-repair-list :info="list" @info="handleClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
