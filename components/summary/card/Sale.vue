<script setup lang="ts">
const props = withDefaults(defineProps<{
  rbText?: string
  marginBottom?: string
  goldPrice?: string
  todaySaleData: Record<string, string>
}>(), {
  rbText: '查看排行',
  marginBottom: '16px',
})
const emit = defineEmits<{
  clickTitle: []
}>()
const id = useId()
const { run, stop } = addMouseEvent(`#${id}`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})

const toTodayPrice = () => {
  navigateTo('/system/gold/price')
}
</script>

<template>
  <div>
    <summary-card-layout title="今日销售" @title-click="emit('clickTitle')">
      <template #gold>
        <div class="px-[8px] py-[2px] cursor-pointer bg-[#fff] color-[#3971F3] rounded-[16px]" @click.stop="toTodayPrice">
          今日金价: ￥{{ props.todaySaleData['金价'] || 0 }}/g
        </div>
      </template>
      <template #default>
        <div :id="id" class="flex overflow-x-scroll gap-[20px] pb-[16px]">
          <template v-for="(item, key) in props.todaySaleData" :key="item">
            <template v-if="key !== '成品金额' && key !== '退货金额' && key !== '金价'">
              <div class="flex-grow-1 flex-shrink-0 h-[68px] flex justify-between flex-col  py-[8px]">
                <div class="text-center">
                  <div class="color-[#808089] dark:color-[#fff] ml-[4px] text-[14px] font-semibold line-height-[24px]">
                    {{ key }}
                  </div>
                </div>
                <div class="color-[#333] dark:color-[#fff] font-semibold pb-[6px] line-height-[24px] text-center">
                  <span class="text-[20px]">{{ item }}</span>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div

          class="flex-grow-1 flex finished gap-[16px]  px-[16px] py-[8px] rounded-[8px] my-[16px]">
          <icon name="i-svg:finished-salesmoney" class="wh-[46px] " />
          <div>
            <div class="color-[#808089] text-[14px] line-height-[24px] pb-[4px]">
              成品金额
            </div>
            <div class="text-[20px] font-semibold line-height-[24px] color-[#333]">
              {{ props.todaySaleData['成品金额'] || 0 }}
            </div>
          </div>
        </div>
        <div class="flex-grow-1 flex gap-[16px] return px-[16px] py-[8px] rounded-[8px]">
          <icon name="i-svg:return-goodmoney" class="wh-[46px]" />
          <div>
            <div class="color-[#808089] text-[14px] line-height-[24px] pb-[4px]">
              退货金额
            </div>
            <div class="text-[20px] font-semibold line-height-[24px] color-[#333]">
              {{ props.todaySaleData['退货金额'] || 0 }}
            </div>
          </div>
        </div>
      </template>
    </summary-card-layout>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.finished {
  background: linear-gradient(92.3deg, #fefbff 49.62%, #f5e0ff 103.48%);
}
.return {
  background: linear-gradient(92.27deg, #ffffff 44.01%, #fff8f2 99.46%);
}
</style>
