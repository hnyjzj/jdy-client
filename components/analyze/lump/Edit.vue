<template>
  <div class="mt-[16px] text-[14px]">
    <common-fold title="商品信息" from-color="rgba(71,126,245,0.6)" to-color="rgba(243,245,254,0.6)">
      <div class="p-[16px]">
        <div class="grid grid-cols-[30%_70%] items-center mb-[12px]">
          <div>图文信息</div>
          <div class="relative">
            <NuxtImg src="/images/empty/record.png" width="100" height="100" />
            <div class="absolute top-[50%] left-[38px] translate-y-[-50%]">
              <icon name="i-icon:camera" size="24" color="#666" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-[30%_70%] items-center mb-[12px]">
          <div>图文信息</div>
          <div class="relative">
            <NuxtImg src="/images/empty/record.png" width="100" height="100" />
            <div class="absolute top-[50%] left-[38px] translate-y-[-50%]">
              <icon name="jdy:camera" size="24" color="#666" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-[30%_70%] items-center mb-[12px]">
          <div>活动描述</div>
          <div>
            <textarea />
          </div>
        </div>
        <div class="grid grid-cols-[30%_70%] mb-[12px]">
          <div>单买价</div>
          <div>
            <common-frame :disabled-style="true" tip="0.00" />
          </div>
        </div>
        <div class="grid grid-cols-[30%_70%] mb-[12px]">
          <div>单买价</div>
          <div>
            <common-frame :disabled-style="true" tip="0.00" />
          </div>
        </div>
        <div class="grid grid-cols-[30%_70%] mb-[12px]">
          <div>库存</div>
          <div>
            <common-frame tip="0.00" />
          </div>
        </div>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>

</style>
