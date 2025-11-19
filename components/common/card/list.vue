<!-- 列表里的卡片组件 -->
<template>
  <div
    class="px-[16px] mb-4 rounded-2 blur-bgc">
    <div
      class="flex justify-between py-[8px] text-color"
      style="border-bottom:1px solid #E6E6E8;"
    >
      <slot name="top" />
      <slot name="status" />
    </div>
    <slot name="info" />
    <div
      class="py-2"
      style="border-top:1px solid #E6E6E8;"
    >
      <slot name="bottom" />
    </div>
  </div>
</template>
