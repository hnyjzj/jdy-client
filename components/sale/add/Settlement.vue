<script lang="ts" setup>

</script>

<template>
  <common-fold title="结算信息" :is-collapse="false">
    <div class="p-[16px]">
      <slot />
    </div>
  </common-fold>
</template>

<style>
.n-border-hover {
  border-color: #3971f3;
}

.n-border-focus {
  border-color: #3971f3;
}
</style>

<style lang="scss" scoped>
.refer {
  --uno: 'flex flex-between min-w-[80px] gap-[4px] px-[12px] py-[6px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}

.remark {
  --uno: 'w-auto border-[#E6E6E8] border border-solid rounded-[8px] px-[4px] pt-[4px] pb-[32px] bg-[#fff] tracking-[1px] text-[14px] dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.3)] color-[#333] dark:color-[#fff] resize-y';
}

textarea::placeholder {
  --uno: 'color-[#cbcdd1]';
}

.operation-enter-active,
.operation-leave-active {
  --uno: 'transition-all ease-in-out duration-500';
}
.operation-enter-from,
.operation-leave-to {
  --uno: 'translate-x-[30px] opacity-0';
}

textarea:focus {
  --uno: 'border border-solid border-[1px] border-[#3971f3] outline-[none]';
}
</style>
