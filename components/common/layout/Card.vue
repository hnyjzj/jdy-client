<template>
  <div class="grid-12">
    <div class="col-12" uno-sm="col-6 offset-3">
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
        <div class="col-12" uno-sm="col-6 offset-3">
          <slot name="footer" />
        </div>
      </div>
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
  --uno: 'h-[60px] fixed left-0 bottom-0 py-10px px-[16px] w-full blur-bgc z-1 grid-12';
}
</style>
