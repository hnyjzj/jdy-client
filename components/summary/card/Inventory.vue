<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  payments: Record<string, string>
}>(), {
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
    <summary-card-layout :title="props.title" @title-click="emit('clickTitle')">
      <template #default>
        <div :id="id" class="flex overflow-x-scroll gap-[20px] ">
          <template v-for="(item, key) in props.payments" :key="key">
            <div class="flex-grow-1 flex-shrink-0">
              <div class="text-[16px] color-[#333] dark:color-[#fff] flex items-center justify-center gap-[2px] font-semibold pb-[6px] line-height-[24px] text-center">
                <common-tooltip :val="item.toString()" placement="top" /><span class="text-[12px] font-normal">
                  {{ unitsd(key) }}</span>
              </div>
              <div class="text-center">
                <div class="color-[#808089] dark:color-[#fff] ml-[4px] text-[13px]  line-height-[24px] ">
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
</style>
