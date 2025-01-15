<script setup lang="ts">
const props = withDefaults(defineProps<{
  leftTitle: string
  marginBottom?: string
}>(), {
  marginBottom: '16px',
})

const { run, stop } = addMouseEvent(`#today`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <div class="blur-bgc rounded-[16px]" :style="{ marginBottom: props.marginBottom }" data-allow-mismatch="style">
    <div class="grid-12">
      <div
        class="skew col-4">
        <div class="skew-right" />
        <div class="skew-text " data-allow-mismatch="text">
          {{ props.leftTitle }}
        </div>
      </div>
    </div>

    <div class="overflow-hidden">
      <div id="today" class="pt-[10px] pl-[6px] text-[10px] overflow-x-scroll" uno-sm="text-[14px]">
        <div
          class="flex">
          <div class="items-title rounded-l-[40px]">
            门店
          </div>
          <div class="items-title">
            总业绩
          </div>
          <div class="items-title">
            中回收旧料抵扣
          </div>
          <div class="items-title">
            中回收旧料抵扣
          </div>
          <div class="items-title">
            低毛利
          </div>
          <div class="items-title">
            低销售额
          </div>
        </div>
        <div class="py-[12px] pb-[16px] pl-[6px] pr-[10px] rounded-l-[20px] text-[10px] flex" uno-sm="text-[14px]">
          <div class="items">
            平顶山潮宏基万达店
          </div>
          <div class="items">
            123344
          </div>
          <div class="items">
            123344
          </div>
          <div class="items">
            123344
          </div>
          <div class="items">
            123344
          </div>
          <div class="items">
            123344
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.items-title {
  --uno: 'col-2 flex-center-row text-center color-#4B576D flex-grow-1 flex-shrink-0 w-[100px] px-[10px] py-[6px] bg-[rgba(199,218,255,0.8)] ';
}
.items {
  --uno: 'col-2 flex-center-row text-center color-[#3971F3] dark:color-[#fff] flex-grow-1 flex-shrink-0 w-100px px-10px';
}
</style>
