<script lang="ts" setup>

</script>

<template>
  <template v-for="i in 3" :key="i">
    <div class="mt-[16px]" @click="jump('/analyze/marketing/detail')">
      <common-fold title="开业活动大秒杀" from-color="rgba(255,255,255,0.6)" to-color="rgba(130,208,250,0.8)" :is-collapse="false">
        <template #title="t">
          <div class="flex pt-[4px]">
            <div class="bust">
              <div class="bust-bg" />
              <NuxtImg class="avatar" src="/images/empty/record.png" />
            </div>
            <div class="text-[14px] pl-4">
              {{ t }}
            </div>
          </div>
        </template>
        <div>
          <div class="p-[16px] text-[14px]">
            <div class="flex justify-between items-center pb-[8px]">
              <div class="text-color-light">
                条码<span class="text-[rgba(57,113,243,1)] pl-[8px]">sp42445</span>
              </div>
              <div class="text-color-light">
                工艺<span class="pl-[8px] text-color">3D</span>
              </div>
            </div>
            <div class="orderinfo">
              <div class="flex justify-between items-center pb-[8px]">
                <div class="text-color-light">
                  创建时间
                </div>
                <div class="text-color">
                  2024-04-08 12:10:24
                </div>
              </div>
            </div>
          </div>
        </div>
      </common-fold>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.bust {
  position: relative;
  .bust-bg {
    --uno: 'w32px h32px bg-[rgba(56,101,252,0.8)] rounded-[8px]';
  }
  .avatar {
    --uno: 'w32px h32px absolute top-[-4px] right-[-4px] rounded-[8px]';
  }
}
.orderinfo {
  --uno: 'py-12px';
  border-top: 1px solid rgba(230, 230, 232, 1);
}
</style>
