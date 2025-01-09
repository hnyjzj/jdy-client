<script setup lang="ts">
useSeoMeta({
  title: '会员权益',
})
</script>

<template>
  <div>
    <common-layout-card>
      <div>
        <div class="bg-[#fff] rounded-[8px] px-[16px] py-[12px] h-[520px] border border-solid border-color-[#E6E6E8]">
          <textarea class="w-full h-full resize-none border-none  bg-transparent" placeholder="默认提示文字" />
        </div>
        <div v-if="false" class="flex-center-col color-[#606266]">
          <common-empty />
          <div>内容为空</div>
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
