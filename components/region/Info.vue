<script setup lang="ts">
const props = defineProps<{
  infoDetail: Region
}>()
</script>

<template>
  <div class="w-full">
    <div
      class=" rounded-[24px] w-full col-12 blur-bgc p-[1px]">
      <div class="h-full flex-col-between">
        <div
          class="py-[8px] pl-[16px]
               bg-gradient-linear-[90deg,#E9F1FE,#95D5FB]
               dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8]
               text-black dark:text-[#FFF]
                rounded-t-[24px]
                flex-between
                ">
          <div class="flex items-center">
            <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
              {{ "区域详情" }}
            </div>
          </div>
          <div>
            <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" />
          </div>
        </div>
        <div class=" px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
          <common-cell label="区域名称" :value="props.infoDetail.name" />
        </div>
      </div>
    </div>
  </div>
</template>
