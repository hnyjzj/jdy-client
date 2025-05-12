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

const TodayInventoryList = ref<DataCardList<TodayInventory>>({
  old_stock_count: '旧料库存件数',
  old_stock_weight: '旧料库存金重',
  product_stock_count: '成品库存件数',
  unsalable_count: '滞销货品件数',
})
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
        <template v-for="(item, key) in TodayInventoryList" :key="key">
          <div class="flex-grow-1 flex-shrink-0">
            <div class="flex-start">
              <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
              <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
                {{ TodayInventoryList[key] }}
              </div>
            </div>
            <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
              <span class="text-[16px]">{{ TodayInventory[key] }}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="bg-[#c7dafF] dark:opacity-[0.5] h-[1px] w-full mt-[8px]" />
      <div class="mt-[12px] flex-between">
        <div />
        <div class="color-[#333]  dark:color-[#fff] text-[12px] line-height-[24px] ">
          <span>
            {{ rbText }}
          </span>
          <icon name="i-icon:left" :size="12" />
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
