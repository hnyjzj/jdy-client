<script setup lang="ts">
const emits = defineEmits<{
  searchList: []
}>()
const searchKey = defineModel('searchKey')
const subsearch = () => {
  emits('searchList')
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
          v-model="searchKey" type="text" class="bg-transparent w-full border-0 placeholder-text-[#fff] flex-1 py-[6px] pl-[4px] line-height-[24px]" placeholder="搜索"
          @keyup.enter="subsearch()">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
