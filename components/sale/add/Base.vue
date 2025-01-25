<script lang="ts" setup>
// const handleClick = async () => {
//   // 跳转到搜索会员页
//   await navigateTo('/sale/search/member')
// }
</script>

<template>
  <common-fold title="基础信息" :is-collapse="false">
    <div class="p-[16px] w-auto flex flex-col gap-[12px]" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
      <slot />
      <!-- <div class="box col-start-1 col-end-3">
        <div class="inplabel">
          会员
        </div>
        <div class="flex flex-row items-center gap-[12px]">
          <common-frame name="自然客流" :is-icon="true" :is-disabled="true" height="40px" class="flex-1">
            <template #left>
              <common-avatar :size="20" rounded="60px" :has-shadow="false" />
            </template>
          </common-frame>
          <div>
            <sale-plusminus @button-click="handleClick" />
          </div>
        </div>
      </div>
      <div class="box">
        <div class="inplabel">
          来源
        </div>
        <common-frame name="收银员" :is-disabled="true" :is-icon="true" height="40px" />
      </div>
      <div class="box">
        <div class="inplabel">
          收银员
        </div>
        <common-frame name="收银员" :is-disabled="true" :is-icon="true" height="40px" />
      </div>
      <div class="box">
        <div class="inplabel">
          销售时间
        </div>
        <common-frame :disabled-style="true" tip="2024-04-08 12:10:24" :is-icon="true" height="40px" />
      </div> -->
    </div>
  </common-fold>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col gap-[8px]';

  .inplabel {
    --uno: 'color-[#333] dark:text-[#FFFFFF] font-size-[14px]';
  }
}
</style>
