<script setup lang="ts">
const props = withDefaults(defineProps<{
  rbText?: string
  marginBottom?: string
  goldPrice?: string
  todayInventory: Record<string, string>
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
</script>

<template>
  <div>
    <summary-card-layout title="今日库存" @title-click="emit('clickTitle')">
      <template #default>
        <div :id="id" class="flex overflow-x-scroll gap-[20px] ">
          <template v-for="(item, key) in props.todayInventory" :key="item">
            <div class="flex-grow-1 flex-shrink-0 ">
              <div class="color-[#333] dark:color-[#fff] font-semibold pb-[6px] line-height-[24px] text-center">
                <span class="text-[20px]">{{ item }}</span>
              </div>
              <div class="text-center">
                <div class="color-[#808089] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px] ">
                  {{ key }}
                </div>
              </div>
            </div>
          </template>
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
</style>
