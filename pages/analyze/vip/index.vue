<!-- 会员分析 -->
<script lang="ts" setup>
useSeoMeta({
  title: '会员分析',
})
const showtime = ref(false)
const currentTime = ref(['12', '00'])
const formatter = (type: string, option: any) => {
  option.text += type === 'hour' ? '时' : type === 'minute' ? '分' : ''
  return option
}
</script>

<template>
  <div class="px-[16px]">
    <div class="flex justify-between items-center py-[12px]">
      <product-manage-company />
      <product-filter-senior />
    </div>
    <div class="mt-[12px]">
      <common-fold title="老会员复购率" from-color="rgba(71,126,245,0.8)" to-color="rgba(243,245,254,0.6)" :is-collapse="false">
        <div class="p-[16px]">
          <div>
            <div class="text-color text-[14px]">
              基准时段
            </div>
            <div class="pt-[8px]" @click="showtime = true">
              <common-frame :is-disabled="true" tip="选择时间">
                <template #left>
                  <div class="mr-1">
                    <icon color="#666666" name="i-icon:calendar" size="14" />
                  </div>
                </template>
              </common-frame>
            </div>
          </div>
          <div class="py-[16px]">
            <div class="text-color text-[14px]">
              统计时段
            </div>
            <div class="pt-[8px]" @click="showtime = true">
              <common-frame :is-disabled="true" tip="选择时间">
                <template #left>
                  <div class="mr-1">
                    <icon color="#666666" name="i-icon:calendar" size="14" />
                  </div>
                </template>
              </common-frame>
            </div>
          </div>
          <common-button-rounded content="开始计算" />
        </div>
      </common-fold>
    </div>
    <van-popup v-model:show="showtime" position="bottom">
      <van-time-picker
        v-model="currentTime"
        title="选择时间"
        :formatter="formatter"
        @click="showtime = false"
      />
    </van-popup>
    <analyze-vip-list />
  </div>
</template>

<style lang="scss" scoped>

</style>
