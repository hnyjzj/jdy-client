<script lang="ts" setup>
const emits = defineEmits<{
  search: []
}>()
const { useWxWork } = useWxworkStore()
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    // showModal.value = true
    // changeType('code')
    // searchProduct.value = code
  }
}
</script>

<template>
  <div class="p-[16px]">
    <div class="btn grid-12 gap-[20px]">
      <div
        class="btn-left col-span-4 offset-2 cursor-pointer" @click="emits('search')">
        <icon name="i-icon:search" color="#fff" :size="12" />
        <div class="ml-2">
          搜索
        </div>
      </div>
      <div
        class="btn-right col-span-4 cursor-pointer" @click="scanCode()"
      >
        <icon name="i-icon:scanit" color="#1a6beb" :size="12" />
        <div class="ml-2">
          扫码
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
