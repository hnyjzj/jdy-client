<script setup lang="ts">
useSeoMeta({
  title: '货品管理',
})
</script>

<template>
  <div class="">
    <div class="grid-12 w-full">
      <div class="col-12  sm:col-8 sm:offset-2 grid-12 px-[16px] py-[12px] ">
        <div class="col-7  color-[#fff]">
          <product-filter-search />
        </div>
        <div class="col-5 flex-end color-[#fff]">
          <product-filter-senior />
          <span class="bg-[#FF624C] text-size-[12px] rounded-full line-height-[20px] text-center color-[#fff]  min-w-[20px] flex justify-center items-center">
            2
          </span>
        </div>
        <div class="col-12 lg:col-8 lg:offset-2 sm:col-8 sm:offset-2 text-size-[14px] line-height-[20px] color-[#fff] px-[16px] py-[12px]">
          搜索结果3条
        </div>
      </div>
      <div class="col-12  sm:col-8 sm:offset-2 px-[16px]">
        <product-manage-fold />
      </div>

      <div class="fixed bottom-0 left-0 right-0 bg-[rgba(241,245,254,1)] px-[16px] py-[12px] grid-12 ">
        <div class="text-size-[14px] line-height-[20px] py-[8px] col-5">
          <span class="color-[#666] mr-[8px]">已选择</span><span class="color-[#3971F3]">2个商品</span>
        </div>
        <div class="col-7 text-size-[16px]  font-semibold offset-5">
          <div class="bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_rgba(57,113,243.0.27)]">
            确定
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
