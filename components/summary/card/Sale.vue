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
          <template v-for="(item, key) in props.todaySaleData" :key="key">
            <template v-if="key !== '成品金额' && key !== '退货金额' && key !== '金价'">
              <div class="flex-grow-1 flex-shrink-0 h-[68px] flex justify-around flex-col ">
                <div class="text-center">
                  <div class="color-[#808089] dark:color-[#fff] ml-[4px] text-[14px] font-semibold line-height-[24px]">
                    {{ key }}
                  </div>
                </div>
                <div class="color-[#333] dark:color-[#fff] font-semibold line-height-[24px] text-center">
                  <span class="text-[16px]">{{ item }}</span>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="grid-12 gap-[16px]">
          <div
            class="flex-grow-1 flex finished gap-[16px] px-[16px] py-[8px] rounded-[8px] col-12 "
            uno-sm="col-6"
            uno-bg="[linear-gradient(92.3deg,_#fefbff_49.62%,_#f5e0ff_103.48%)] "
            uno-dark:bg="[linear-gradient(96.41deg,_#0f1e52_76.65%,_#672580_102.56%)]"
          >
            <icon name="i-svg:finished-salesmoney" class="wh-[46px] " />
            <div>
              <div class="color-[#808089] text-[14px] line-height-[24px] pb-[4px]">
                成品金额
              </div>
              <div class="text-[16px] font-semibold line-height-[24px]  text-color">
                {{ props.todaySaleData['成品金额'] || 0 }}
              </div>
            </div>
          </div>
          <div
            class="flex-grow-1 flex gap-[16px] return px-[16px] py-[8px] rounded-[8px] col-12"
            uno-sm="col-6"
            uno-bg="[linear-gradient(91.88deg,_#FFFFFF_5.12%,_#FFEFE2_99.55%)] "
            uno-dark:bg="[linear-gradient(96deg,_#0F1E52_76.65%,_#633A16_101.86%)]"
          >
            <icon name="i-svg:return-goodmoney" class="wh-[46px]" />
            <div>
              <div class="color-[#808089] text-[14px] line-height-[24px] pb-[4px]">
                退货金额
              </div>
              <div class="text-[16px] font-semibold line-height-[24px] text-color">
                {{ props.todaySaleData['退货金额'] || 0 }}
              </div>
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
</style>
