<script lang="ts" setup>
const emits = defineEmits(['filter'])
const filter = () => {
  emits('filter')
}
</script>

<template>
  <div>
    <div class="py-[6px] px-[12px] flex-end cursor-pointer cursor-pointer" @click="filter">
      <div class="mr-[4px]">
        <van-icon name="filter-o" />
      </div>
      <div class="text-size-[14px] font-semibold line-height-[20px]">
        高级筛选
      </div>
    </div>
  </div>
</template>
