<script setup lang="ts">
const props = defineProps<{
  productList: Product[]
  filterList: ProductWhere
}>()
</script>

<template>
  <div class="grid-12">
    <div class="col-12 lg:col-8 lg:offset-2 grid-12 gap-[24px]">
      <template v-for="(item, index) in props.productList" :key="index">
        <div
          class="col-12 sm:col-6 rounded-[24px] blur-bgc p-[1px]">
          <div
            class="py-[8px] px-[16px] bg-gradient-linear-[90deg,#E9F1FE,#95D5FB] dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8] rounded-t-[24px] flex-start text-black dark:text-[#FFF]">
            <common-avatar :wh="32" :size="24" />
            <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
              {{ item?.name }}
            </div>
          </div>
          <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]" @click="jump('/product/finished/list', { code: item.code })">
            <van-row justify="space-between" class="py-[4px]">
              <van-col span="12">
                <div class="">
                  所属大类
                </div>
              </van-col>
              <van-col span="12">
                <div class="text-align-end">
                  {{ props.filterList.class?.preset[item.class] }}
                </div>
              </van-col>
            </van-row>
            <van-row justify="space-between" class="py-[4px]">
              <van-col span="12">
                <div class="">
                  材质
                </div>
              </van-col>
              <van-col span="12">
                <div class="text-align-end">
                  {{ props.filterList.material?.preset[item.class] }}
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="bg-[#F3F5FE] dark:bg-[#F3F5FE1A] rounded-b-[24px] ">
            <van-row justify="space-between">
              <van-col span="8">
                <div class="py-[8px] px-[16px]">
                  <span
                    class="bg-[#FFF4CD] px-[8px] text-size-[14px] line-height-5 color-[#DD9200] rounded-[8px] text-center">
                    调拨在途
                  </span>
                </div>
              </van-col>
              <van-col span="12">
                <div class="flex-end text-size-[14px] ">
                  <common-button-irregular text="编辑" />
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
