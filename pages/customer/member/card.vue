<script setup lang="ts">
useSeoMeta({
  title: '会员卡',
})
definePageMeta({ layout: false })
const checked = ref<boolean>(true)
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
        <div>
          <div class="h-[160px] bg-[#fff] rounded-[8px]" />

          <div class="h-[66px] of-hidden overflow-x-scroll no-scrollbar flex flex-nowrap my-[16px]">
            <div class="w-[100px] h-[66px] bg-[#FFFFFF66] rounded-[8px] mr-[20px] shrink-0" />
            <div class="w-[100px] h-[66px] bg-[#FFFFFF66] rounded-[8px] mr-[20px] shrink-0" />
            <div class="w-[100px] h-[66px] bg-[#FFFFFF66] rounded-[8px] mr-[20px] shrink-0" />
            <div class="w-[100px] h-[66px] bg-[#FFFFFF66] rounded-[8px] mr-[20px] shrink-0" />
            <div class="w-[100px] h-[66px] bg-[#FFFFFF66] rounded-[8px] mr-[20px] shrink-0" />
          </div>
          <div class="flex-start mb-[12px]">
            <span class="w-[100px]">启用状态</span> <van-switch v-model="checked" size="24" />
          </div>
          <div class="flex-start mb-[12px]">
            <span class="w-[100px]">会员卡主标题</span> <span>郑州金美福珠宝有限公司</span>
          </div>
          <div class="flex-start mb-[12px]">
            <span class="w-[100px]">会员卡名称</span>
            <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]" :style="{ background: checked ? '#fff' : '#DEDEDE' }">
              <input :disabled="!checked" type="text" class="w-full border-none bg-transparent" placeholder="请输入">
            </div>
          </div>
          <div class="flex-start mb-[12px]">
            <span class="w-[100px]">会员卡描述</span>
            <div class="bg-[#DEDEDE] flex-1 h-[110px] p-[12px] rounded-[8px] border-color-[#E9EBEE] border-solid border" :style="{ background: checked ? '#fff' : '#DEDEDE' }">
              <textarea :disabled="!checked" class="w-full h-full resize-none border-none  bg-transparent" placeholder="默认提示文字" />
            </div>
          </div>
          <div class="flex-start mb-[8px]">
            <span class="w-[100px]">会员logo</span>
            <van-switch v-model="checked" size="24" />
          </div>
          <div class="flex-start text-[12px] color-[#808089]">
            <span class="w-[100px]" />
            <div>默认logo 不可修改</div>
          </div>

          <div class="fixed left-0 bottom-0  px-[16px] py-[12px] blur-bgc w-full border-t-solid b-t-[1px] border-color-[#E6E6E8] grid-12 ">
            <div class="col-4">
              <common-button-rounded content="取消" color="#fff" />
            </div>
            <div class="col-7 offset-5">
              <common-button-rounded content="保存" />
            </div>
          </div>
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>
