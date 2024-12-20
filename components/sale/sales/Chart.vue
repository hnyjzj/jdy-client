<script setup lang="ts">
// 销售明细图_组件
// TODO: 后端接口返回数据后，替换以下数据
interface Pics {
  url: string[]
  data: string
}
const props = defineProps<{
  pics: Pics[]
}>()
</script>

<template>
  <template v-for="(item, index) in props.pics" :key="index">
    <common-gradient :title="item.data" theme="theme" text-color="#1B2129">
      <template #body>
        <div class="grid grid-cols-1 gap-x-[12px] gap-y-[12px] pb-[12px]" uno-sm="grid-cols-2" uno-md="grid-cols-3 gap-[20px]" uno-lg="grid-cols-4 gap-[20px]">
          <template v-for="(url, urlIndex) in item.url" :key="urlIndex">
            <div class="chart-item">
              <div class="rounded-[24px]">
                <img :key="index" :src="url" class="flex items-center justify-center bg-[#fff] rounded-[8px] w-full">
              </div>
              <div class="info gap-[6px] pt-[12px]">
                <div class="item">
                  <div class="title">
                    名称
                  </div>
                  <div class="desc">
                    足金999
                  </div>
                </div>
                <div class="item">
                  <div class="title">
                    条码
                  </div>
                  <div class="desc">
                    jdy129712
                  </div>
                </div>
                <div class="item">
                  <div class="title">
                    金重
                  </div>
                  <div class="desc">
                    12.9kg
                  </div>
                </div>
                <div class="item">
                  <div class="title">
                    款号
                  </div>
                  <div class="desc">
                    暂无
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </common-gradient>
  </template>
</template>

<style lang="scss" scoped>
.chart-item {
  --uno: 'flex flex-col gap-[12px] bg-[rgba(241,245,254,.5)] rounded-[24px] overflow-hidden border-solid border-1 border-[#EFF0F6] dark:bg-[rgb(245,245,245,0.1)] rounded-[24px] shadow-[0_10px_20px_-7px_rgb(0,0,0,0.1)] gap-[12px] overflow-hidden dark:border-[rgb(239,240,246,0.1)] px-[16px] py-[16px]';
}
.info {
  --uno: 'flex flex-col border-t-[1px] border-t-solid border-t-[rgba(230,230,232,1)] dark:border-t-[rgba(230,230,232,0.1)]';

  .item {
    --uno: 'flex-center-between';
    .title {
      --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
    }
    .desc {
      --uno: 'text-size-[14px] color-[#333] dark:color-[#fff]';
    }
  }
}
</style>
