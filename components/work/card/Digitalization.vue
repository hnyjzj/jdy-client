<script setup lang="ts">
const props = withDefaults(defineProps<{
  leftTitle: string
  marginBottom?: string
}>(), {
  marginBottom: '16px',
})
const { $colorMode } = useNuxtApp()
</script>

<template>
  <div class="blur-bgc rounded-[16px] overflow-hidden" :style="{ marginBottom: props.marginBottom }" data-allow-mismatch="style">
    <div class="grid-12">
      <div
        class="skew col-4">
        <div class="skew-right" />
        <div class="skew-text " data-allow-mismatch="text">
          {{ props.leftTitle }}
        </div>
      </div>
    </div>

    <div class="table pt-[20px]">
      <n-data-table
        :style="{
          '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : '#1A6BEB',
          '--n-merged-td-color': $colorMode.value === 'light' ? 'rgba(203,219,240,1)' : '#224879',
          '--n-merged-border-color': 'rgba(57,113,243,0.08)',
        }"
        :columns="[
          {
            title: '门店',
            key: 'store',
            width: '100px',
            fixed: 'left',
            className: 'age',
            align: 'center',
          },
          {
            title: '总业绩',
            key: 'performance',
            fixed: 'left',
            width: '100px',
          },
          {
            title: '中回收旧料抵扣',
            key: 'title1',
            width: '100px',
          },

          {
            title: '中回收旧料抵扣',
            key: 'title2',
            width: '100px',
          },
          {
            title: '低毛利',
            key: 'length',
            width: '100px',
          },
          {
            title: '低销售额',
            key: 'length',

          }]"
        :data="[
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
          { store: '郑州紫金山店', title: '2313131', title1: '342354.454', length: '2313131', performance: '102222.00', title2: 12000.00 },
        ]"
        :max-height="300"
        :scroll-x="600"
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
</style>
