<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  infoDetail: Stores
}>()

// 转换省市区名字
const addressName = computed(() => {
  return toProvinces(props.infoDetail.province, props.infoDetail.city, props.infoDetail.district)
})
</script>

<template>
  <div class="w-full">
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden">
      <div class="rounded-[24px]">
        <common-gradient title="基本信息">
          <template #body>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  Logo
                </div>
                <div>
                  <img :src="ImageUrl(props.infoDetail?.logo)" mode="asc" class="w-auto max-w-[150px] h-[100px]">
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  门店名称
                </div>
                <div class="color-[#333333] max-w-[60%] dark:color-[#fff]">
                  {{ props.infoDetail.name }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  省市区
                </div>
                <div class="color-[#333333] max-w-[60%] dark:color-[#fff]">
                  {{ addressName }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  地址
                </div>
                <div class="color-[#333333] max-w-[60%] dark:color-[#fff]">
                  {{ props.infoDetail.address }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  联系方式
                </div>
                <div class="color-[#333333] dark:color-[#fff]">
                  {{ props.infoDetail.contact }}
                </div>
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </div>
</template>
