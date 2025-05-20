<script lang="ts" setup>
const emits = defineEmits<{
  search: []
}>()
</script>

<template>
  <div class="p-[16px]">
    <div class="btn grid-12 gap-[8px]">
      <div
        class="btn-left col-6 offset-3 cursor-pointer" uno-sm="col-4 offset-4" @click="emits('search')">
        <icon name="i-icon:search" color="#fff" :size="16" />
        <div class="ml-2">
          搜索
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center py-[10px]';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
