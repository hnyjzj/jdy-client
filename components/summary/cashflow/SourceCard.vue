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
  <div class="bg-[#DEEBFD] dark:bg-[rgba(0,0,0,0.3)]  rounded-[16px]  overflow-hidden mb-[16px]" data-allow-mismatch="style">
    <div class=" rounded-[4px]">
      <div class="grid-12 pb-[16px]">
        <div
          class="skew col-6 cursor-pointer"
          uno-md="col-4">
          <div class="skew-right" />
          <div class="skew-text pl-[15px] text-[16px] font-semibold">
            <div class="flex-center-row h-full">
              <slot name="header-title" />
            </div>
          </div>
        </div>
        <div class="col-6 flex-end" uno-md="col-4 offset-8" />
      </div>
    </div>

    <n-data-table
      :style="{
        '--n-merged-th-color': $colorMode.value === 'light' ? '#C7DAFF' : '#1A6BEB',
        '--n-merged-td-color': $colorMode.value === 'light' ? '#DEEBFD' : '#224879',
        '--n-merged-border-color': 'rgba(57,113,243,0.08)',
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
</style>
