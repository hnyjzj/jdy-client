<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: any[]
  stockList?: any
  loading?: boolean
}>(), {
  stockList: [],
})
const { $colorMode } = useNuxtApp()
const scrollX = ref(0)

for (let i = 0; i < props.title.length; ++i) {
  scrollX.value += 100
}
</script>

<template>
  <div class="blur-bgc rounded-[16px] overflow-hidden mb-[16px]" data-allow-mismatch="style">
    <div class="">
      <slot name="header" />
    </div>

    <div class="table pt-[20px]">
      <n-data-table
        :style="{
          '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : '#1A6BEB',
          '--n-merged-td-color': $colorMode.value === 'light' ? 'rgba(203,219,240,1)' : '#224879',
          '--n-merged-border-color': 'rgba(57,113,243,0.08)',
        }"
        :loading="props.loading"
        :columns="props.title"
        :data="props.stockList"
        :scroll-x="scrollX"
        :max-height="650"
        :bordered="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.items-title {
  --uno: 'col-2 text-center color-#4B576D  flex-grow-1 flex-shrink-0 px-[10px] py-[6px] bg-[rgba(199,218,255,0.8)] ';
}
.items {
  --uno: 'col-2 text-center color-[#3971F3] dark:color-[#fff] flex-grow-1 flex-shrink-0  px-[10px] py-[6px]';
}
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.skew-text {
  display: flex;
  align-items: flex-start;
}
</style>
