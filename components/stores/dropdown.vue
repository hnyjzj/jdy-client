<script lang="ts" setup>
// 下拉菜单组件
const props = withDefaults(defineProps<{
  options: any
  show: boolean
}>(), {
  show: false,
})
</script>

<template>
  <div class="w-full relative">
    <slot />
    <n-scrollbar style="max-height: 120px" trigger="none">
      <template v-for="(item, index) in props.options" :key="index">
        <div class="py-[6px] px-[4px] items">
          {{ item.label }}
        </div>
      </template>
    </n-scrollbar>

    <!-- <div v-if="show" class="w-full bg-[#fff] p-[8px] py-[12px] rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)] absolute z-1 h-[200px] overflow-hidden overflow-y-scroll touch ">
      <template v-for="(item, index) in props.options" :key="index">
        <div class="py-[6px] px-[4px] items">
          {{ item.label }}
        </div>
      </template>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.items:hover {
  background-color: #f0f0f0;
  border-radius: 6px;
}
.touch {
  touch-action: none;
}
</style>
