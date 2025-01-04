<template>
  <div>
    <div class="header">
      <div>
        <product-manage-company />
      </div>
      <div>
        <slot name="header-right" />
      </div>
    </div>
    <div class="body blur-bgc rounded-t-[24px] p-[16px]">
      <slot />
    </div>
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  --uno: 'h-56[px] flex justify-between items-center color-#fff  px-[16px] py-[12px]';
}
.body {
  height: calc(100vh - 56px - 60px);
}
.footer {
  --uno: 'h-[60px] fixed left-0 bottom-0 py-10px px-[16px] blur-bgc w-full grid-12';
}
</style>
