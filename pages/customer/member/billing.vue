<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div>
    <NuxtLayout name="member">
      <template #header>
        <div class="grid-12 px-[16px] flex-start" :style="{ height: 'var(--navbar-height)' }">
          <div class="col-4 color-[#fff] ">
            <product-manage-company />
          </div>
        </div>
      </template>
      <template #body>
        <div class="flex-between text-[14px]">
          <div> 1、开单后 </div>
          <div class="bg-[#fff] py-[10px] px-[12px] rounded-[36px] ">
            <div class="w-[117px]">
              <input type="text" class="w-full border-none bg-transparent" placeholder="0">
            </div>
          </div>
          <div>天，接受回访</div>
          <div class="wh-[32px] bg-[#fff] rounded-[50%] flex-center-row">
            <div class="w-[10px] h-[2px]  bg-[#3971F3]" />
          </div>
        </div>

        <div class="fixed left-0 bottom-0  px-[16px] py-[12px] blur-bgc w-full border-t-solid b-t-[1px] border-color-[#E6E6E8] grid-12 ">
          <div class="col-4">
            <common-button-rounded content="取消" color="#fff" />
          </div>
          <div class="col-7 offset-5">
            <common-button-rounded content="保存" />
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
