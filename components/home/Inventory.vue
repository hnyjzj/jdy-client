<script setup lang="ts">
const props = withDefaults(defineProps<{
  rbText?: string
  marginBottom?: string
  goldPrice?: string
}>(), {
  rbText: '查看排行',
  marginBottom: '16px',
})
const { myStoreTodayInventory } = homeDataStore()
const { TodayInventory } = storeToRefs(homeDataStore())
const { myStore } = storeToRefs(useStores())
await myStoreTodayInventory({ store_id: myStore.value.id })
const id = useId()
const { run, stop } = addMouseEvent(`#${id}`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})
watch(
  () => myStore.value.id, // 监听 myStore 的 id 属性变化
  async (newId) => {
    // 这里可以触发重新获取销售数据
    await myStoreTodayInventory({ store_id: newId })
  },
)
</script>

<template>
  <div class="blur-bgc rounded-[16px]  cursor-pointer" :style="{ marginBottom: props.marginBottom }">
    <div class="grid-12">
      <div
        class="skew col-6" uno-md="col-4">
        <div class="skew-right" />
        <div class="skew-text pl-[15px]">
          本店今日库存
        </div>
      </div>
    </div>

    <div class="p-[16px] ">
      <div :id="id" class="flex overflow-x-scroll gap-[20px]">
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              旧料库存件数
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]">{{ TodayInventory.old_stock_count }}</span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              旧料库存金重
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]">{{ TodayInventory.old_stock_weight }}</span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              成品库存件数
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]">{{ TodayInventory.product_stock_count }}</span>
          </div>
        </div>
        <div class="flex-grow-1 flex-shrink-0">
          <div class="flex-start">
            <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
            <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
              滞销货品件数
            </div>
          </div>
          <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
            <span class="text-[16px]">{{ TodayInventory.unsalable_count }}</span>
          </div>
        </div>
      </div>
      <div class="bg-[#c7dafF] dark:opacity-[0.5] h-[1px] w-full mt-[8px]" />
      <div class="mt-[12px] flex-between">
        <div />
        <div class="color-[#333]  dark:color-[#fff] text-[12px] line-height-[24px] ">
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
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.skew-text {
  display: flex;
  align-items: flex-start;
}
</style>
