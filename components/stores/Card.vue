<script setup lang="ts">
const emits = defineEmits<{
  getDetail: [val: string]
  editStore: [val: string]
  deleteStore: [val: string]
}>()
const { storesList } = storeToRefs(useStores())
// 转换省市区名字 toProvinces
</script>

<template>
  <common-layout-center>
    <div class="col-12 lg:col-8 lg:offset-2 grid-12 gap-[24px]">
      <template v-for="(item, index) in storesList" :key="index">
        <div
          class="col-12 sm:col-6 xl:col-4 rounded-[24px] blur-bgc p-[1px]">
          <div class="h-full flex-col-between">
            <div
              class="py-[8px] px-[16px] bg-gradient-linear-[90deg,#E9F1FE,#95D5FB] dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8] rounded-t-[24px] flex-start text-black dark:text-[#FFF]">
              <template v-if="item.logo">
                <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.logo)" />
              </template>

              <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                {{ item.name }}
              </div>
            </div>
            <div class="flex-1 px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <common-cell label-color="#000" label="别名" :value="item.alias" />
              <common-cell label-color="#000" label="所属区域" :value="item.region?.name" />
              <template v-if="item.staffs.length > 0">
                <div class="flex-between min-h-[28px] pb-[4px]">
                  <div>
                    员工
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
                      <n-tag> {{ item.staffs[0].nickname }} </n-tag>
                      <template v-if="item.staffs.length - 1 > 0">
                        <n-tag>+{{ item.staffs.length - 1 }} </n-tag>
                      </template>
                    </span>
                  </div>
                </div>
              </template>
              <template v-if="item.superiors.length > 0">
                <div class="flex-between min-h-[28px]">
                  <div>
                    负责人
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
                      <n-tag> {{ item.superiors[0].nickname }} </n-tag>
                      <template v-if="item.superiors.length - 1 > 0">
                        <n-tag>+{{ item.superiors.length - 1 }} </n-tag>
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="bg-[#F3F5FE] dark:bg-[#F3F5FE1A] rounded-b-[24px] ">
              <div class="flex-between">
                <div />
                <div class="text-size-[14px] col-6 offset-6" uno-sm="col-7 offset-5" uno-xl="col-7 offset-5">
                  <div @click="emits('getDetail', item.id)">
                    <common-button-irregular text="编辑" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </common-layout-center>
</template>
