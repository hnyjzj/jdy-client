<script setup lang="ts">
const props = withDefaults(defineProps<{
  leftTitle: string
  marginBottom?: string
  list: StorePerformance[]
}>(), {

  marginBottom: '16px',
})
const { $colorMode } = useNuxtApp()
</script>

<template>
  <div class="blur-bgc rounded-[16px] overflow-hidden" :style="{ marginBottom: props.marginBottom }" data-allow-mismatch="style">
    <div class="grid-12">
      <div
        class="skew col-6" uno-md="col-4">
        <div class="skew-right" />
        <div class="skew-text pl-[15px]" data-allow-mismatch="text">
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
            key: 'name',
            width: '100px',
            fixed: 'left',
            className: 'age',
            align: 'center',
          },
          {
            title: '总业绩',
            key: 'total',
            fixed: 'left',
            width: '100px',
            align: 'center',
          },
          {
            title: '银饰',
            key: 'silver',
            width: '100px',
            align: 'center',
          },

          {
            title: '足金（件）',
            key: 'gold',
            width: '100px',
            align: 'center',
          },
          {
            title: '足金件兑换旧料抵扣',
            key: 'gold_deduction',
            width: '100px',
            align: 'center',
          },
          {
            title: '足金克',
            key: 'gold_weight',
            width: '100px',
            align: 'center',
          },
          {
            title: '足金克兑换旧料抵扣',
            key: 'gold_weight_deduction',
            width: '100px',
            align: 'center',
          },
          {
            title: '计件配件',
            key: 'piece_accessories',
            width: '100px',
            align: 'center',
          }]"

        :data="props.list"
        :max-height="300"
        :scroll-x="800"
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
