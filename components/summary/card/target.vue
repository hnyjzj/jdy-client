<script setup lang="ts">
const props = withDefaults(defineProps<{
  rbText?: string
  marginBottom?: string
  goldPrice?: string
  data: Record<string, string>
}>(), {
  rbText: '查看',
  marginBottom: '16px',
})
const emit = defineEmits<{
  clickTitle: []
  seemore: []
}>()
const id = useId()
const { run, stop } = addMouseEvent(`#${id}`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <div class="bg-[#DEEBFD] dark:bg-[rgba(0,0,0,0.3)]  rounded-[16px]  cursor-pointer" :style="{ marginBottom: props.marginBottom }">
    <div class="grid-12">
      <div
        class="skew col-6" uno-md="col-4" @click="emit('clickTitle')">
        <div class="skew-right" />
        <div class="skew-text pl-[15px] text-[16px] font-semibold">
          <div class="flex-center-row h-full">
            销售目标
          </div>
        </div>
      </div>
    </div>

    <div class="p-[16px] ">
      <div :id="id" class="flex overflow-x-scroll gap-[20px]">
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              目标
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]"> {{ data.purpose || 0 }} </span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              完成率
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]"> {{ data.achieve_rate || 0 }} </span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              已完成
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]"> {{ data.achieve || 0 }} </span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              剩余
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]"> {{ data.remainder || 0 }} </span>
          </div>
        </div>
      </div>
      <div class="bg-[#c7dafF] dark:opacity-[0.5] h-[1px] w-full mt-[8px]" />
      <div class="mt-[12px] flex-between color-[#4B576D]" @click="emit('seemore')">
        <div>
          {{ formatTimestampToDateTime(data.start_time) }} ~ {{ formatTimestampToDateTime(data.end_time) }}
        </div>
        <!-- <div class="color-[#333]  dark:color-[#fff] text-[12px] line-height-[24px] flex">
          <span>
            {{ rbText }}
          </span>
          <icon name="i-icon:left" :size="12" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.skew-text {
  display: flex;
  align-items: flex-start;
}
</style>
