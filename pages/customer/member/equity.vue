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
        <div class="bg-[#fff] rounded-[8px] px-[16px] py-[12px] h-[520px] border border-solid border-color-[#E6E6E8]">
          <textarea class="w-full h-full resize-none border-none  bg-transparent" placeholder="默认提示文字" />
        </div>
        <div v-if="false" class="flex-center-col color-[#606266]">
          <common-empty />
          <div>内容为空</div>
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
