<script setup lang="ts">
useSeoMeta({
  title: '会员卡',
})
const checked = ref<boolean>(true)
</script>

<template>
  <div>
    <common-layout-card>
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
          <span class="w-[100px]">启用状态</span>
          <n-switch v-model="checked" size="large" />
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
          <n-switch v-model="checked" size="large" />
        </div>
        <div class="flex-start text-[12px] color-[#808089]">
          <span class="w-[100px]" />
          <div>默认logo 不可修改</div>
        </div>
      </div>
      <template #footer>
        <div class="grid-12 w-full " uno-sm="col-6 offset-3">
          <div class="col-4" uno-sm="col-4">
            <common-button-rounded content="取消" bgc="#fff" color="#3971F3" />
          </div>
          <div class="col-7 offset-5" uno-sm="col-6 offset-5">
            <common-button-rounded content="保存" />
          </div>
        </div>
      </template>
    </common-layout-card>
  </div>
</template>
