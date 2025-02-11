<script setup lang="ts">
const emits = defineEmits<{
  searchList: [clear: boolean ]
}>()
const searchKey = defineModel('searchKey')
const subsearch = (clear: boolean = false) => {
  emits('searchList', clear)
}
</script>

<template>
  <div>
    <div class="px-[12px] bg-[#FFFFFF66] border-rd-full text-size-[20px] shadow-lg flex items-center">
      <div class=" left-[10px] top-[6px]">
        <van-icon name="search" />
      </div>
      <div class="text-size-[14px] line-height-[20px] flex-1">
        <input
          v-model="searchKey" type="search" autocomplete="off" class="bg-transparent w-full border-0 placeholder-text-[#fff] flex-1 py-[6px] pl-[4px] line-height-[24px]" placeholder="搜索"
          @keyup.enter="subsearch()">
      </div>
      <div @click="subsearch(true)">
        <icon name="i-icon:search-close" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
</style>
