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
              <div class="flex-grow-1 flex-shrink-0 h-[68px] flex justify-between flex-col">
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
        <div class="flex-grow-1 flex finished px-[16px] py-[12px] rounded-[8px] my-[16px]">
          <!-- <img src="/images/icon/finished-sales-money.png" alt=""> -->
        </div>
        <div class="flex-grow-1 flex return px-[16px] py-[12px] rounded-[8px]">
          <!-- <img src="/images/icon/return-good-money.png" alt=""> -->
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
.skew-text {
  display: flex;
  align-items: flex-start;
}
.finished {
  background: linear-gradient(92.3deg, #fefbff 49.62%, #f5e0ff 103.48%);
}
.return {
  background: linear-gradient(92.27deg, #ffffff 44.01%, #fff8f2 99.46%);
}
</style>
