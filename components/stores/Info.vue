<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  infoDetail: getStoreDetailRes
}>()

// 转换省市区名字
const addressName = computed(() => {
  return toProvinces(props.infoDetail.province, props.infoDetail.city, props.infoDetail.district)
})
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden" uno-lg="col-4 offset-4" uno-md="col-12">
      <div class="rounded-[24px]">
        <common-gradient :title="props.infoDetail?.name">
          <template #body>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  上级门店
                </div>
                <div class="color-[#333333]">
                  {{ props.infoDetail.parent?.name || '无' }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  省市区
                </div>
                <div class="color-[#333333]">
                  {{ addressName }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  地址
                </div>
                <div class="color-[#333333]">
                  {{ props.infoDetail.address }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  联系方式
                </div>
                <div class="color-[#333333]">
                  {{ props.infoDetail.contact }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  排序
                </div>
                <div class="color-[#333333]">
                  {{ props.infoDetail.sort }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666]">
                  企业微信id
                </div>
                <div class="color-[#333333]">
                  {{ props.infoDetail.wxwork_id }}
                </div>
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </div>
</template>
