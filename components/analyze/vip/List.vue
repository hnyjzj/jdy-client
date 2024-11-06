<script lang="ts" setup>

</script>

<template>
  <div>
    <template v-for="i in 3" :key="i">
      <div class="mt-4" @click="jump('/analyze/vip/detail')">
        <common-fold title="标题/名称/单号/条码示例" from-color="rgba(255,255,255,0.6)" to-color="rgba(130,208,250,0.8)" :is-collapse="false">
          <template #title>
            <div class="py-[6px]">
              <div>标题/名称/单号/条码示例</div>
            </div>
          </template>
          <div>
            <div class="p-[16px] text-[14px]">
              <div class="flex justify-between items-center pb-[8px]">
                <div class="text-color">
                  条码<span class="text-[rgba(57,113,243,1)] pl-[8px]">sp42445</span>
                </div>
                <div class="text-color-light">
                  工艺<span class="pl-[8px]">3D</span>
                </div>
              </div>
            </div>
            <div />
          </div>
        </common-fold>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
