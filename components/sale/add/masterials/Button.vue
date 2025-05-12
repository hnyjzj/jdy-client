<script lang="ts" setup>
const emits = defineEmits<{
  handleAdd: []
  searchQl: []
}>()
</script>

<template>
  <div class="p-[16px]">
    <div class="grid-12 gap-[20px]">
      <div
        class="btn-left col-span-4 offset-2 cursor-pointer" @click="emits('searchQl')">
        <icon name="i-icon:search" color="#fff" :size="12" />
        <div class="ml-2">
          搜索
        </div>
      </div>
      <div
        class="btn-right col-span-4 cursor-pointer" @click="emits('handleAdd')"
      >
        <div class="ml-2">
          手动添加
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
</style>
