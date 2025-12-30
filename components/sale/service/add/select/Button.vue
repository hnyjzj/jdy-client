<script lang="ts" setup>
const emits = defineEmits<{
  handleAdd: []
  searchQl: []
}>()
const { isDark } = storeToRefs(useThemeStore())
const theme = computed(() => isDark.value ? '1px solid #fff' : '1px solid #1a6beb')
</script>

<template>
  <div class="p-[16px]">
    <div class="grid-12 gap-[8px]">
      <div
        class="btn-left col-6  cursor-pointer" uno-sm="col-4 offset-2" @click="emits('searchQl')"
      >
        <icon name="i-icon:search" color="#fff" :size="16" />
        <div class="ml-2">
          搜索
        </div>
      </div>
      <div
        class="col-6 cursor-pointer" uno-sm="col-4 offset-6" @click="emits('handleAdd')">
        <common-button-rounded content="手动添加" bgc="#F1F5FE" color="#1a6beb" :border="theme" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] py-[9px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
