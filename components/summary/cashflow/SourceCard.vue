<script lang="ts" setup>
const props = defineProps<{
  title: any[]
  list?: any[]
  loading?: boolean
}>()
const scrollX = ref(0)

for (let i = 0; i < props.title.length; ++i) {
  scrollX.value += 100
}
</script>

<template>
  <div class="bg   rounded-[16px]  overflow-hidden mb-[16px]" data-allow-mismatch="style">
    <div class="flex justify-between items-center pt-[12px] pb-[16px] px-[16px]">
      <div class="color-[#1A6DD8] flex gap-[6px] text-[16px] font-semibold line-height-[24px]">
        <img src="/images/icon/today-sale.png" class="wh-[24px]">
        <slot name="header-title" />
      </div>
    </div>

    <div class="px-[16px]">
      <n-data-table
        :style="{
          '--n-merged-td-color-hover': '#DAEAFF',
          '--n-merged-td-color': $colorMode.value === 'light' ? '#fff' : '#224879',
          '--n-merged-border-color': 'rgba(57,113,243,0.0)',
        }"
        :columns="props.title"
        :data="props.list"
        :scroll-x="scrollX"
        :max-height="350"
        :bordered="true"
        :render-cell="(value: any) => {
          if (!value){
            return 0
          }
          return value
        }"
      />
    </div>
  </div>

  <div />
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
.chart {
  width: 100%;
  height: 530px;
}
.bg {
  background: linear-gradient(180deg, #daeaff 0%, #ffffff 30.77%, #ffffff 71.15%);
  box-shadow: 0px 5px 20px 0px #0000000a;
}
:deep(.n-data-table .n-data-table-th) {
  background-color: #f3f3f3 !important;
}
</style>
