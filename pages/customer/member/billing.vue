<script setup lang="ts">
useSeoMeta({
  title: '会员开单回访',
})
</script>

<template>
  <div>
    <common-layout-card>
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
