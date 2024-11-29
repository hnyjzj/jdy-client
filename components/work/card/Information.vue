<script setup lang="ts">
const props = withDefaults(defineProps<{
  leftTitle: string
  rbText?: string
  list: { title: string, number: number }[]
  marginBottom?: string
}>(), {
  rbText: '查看排行',
  marginBottom: '16px',
})
</script>

<template>
  <div class="blur-bgc rounded-[16px]  cursor-pointer" :style="{ marginBottom: props.marginBottom }">
    <div class="grid-12">
      <div
        class="skew col-4">
        <div class="skew-right" />
        <div class="skew-text ">
          {{ props.leftTitle }}
        </div>
      </div>
    </div>

    <div class="p-[16px]">
      <div class="flex-between">
        <template v-for="(item, index) in list" :key="index">
          <div class="flex-col">
            <div class="flex-start">
              <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
              <div class="color-[#428EFF] ml-[4px] text-[12px]  line-height-[24px]">
                {{ item.title }}
              </div>
            </div>
            <div class="color-[#3971F3] font-semibold  line-height-[24px]">
              <span class="text-[16px]">{{ item.number }}</span>
              <span class="text-[12px]">万</span>
            </div>
          </div>
        </template>
      </div>
      <div class="bg-[#C2D5FA] h-[1px] w-full mt-[8px]" />
      <div class="mt-[12px] flex-between">
        <div class="bg-[#C7DAFF] text-[12px] line-height-[24px] px-[10px] rounded-[60px]">
          金价：12313
        </div>
        <div class="color-[#3971F3]  text-[12px] line-height-[24px] ">
          <span>
            {{ rbText }}
          </span>
          <van-icon name="play" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
