<script setup lang="ts">
const emits = defineEmits<{
  getDetail: [val: string]
  editRegion: [val: string]
  deleteRegion: [val: string]
}>()
const { regionList } = storeToRefs(useRegion())
</script>

<template>
  <row>
    <div class="col-12 lg:col-8 lg:offset-2 grid-12 gap-[24px]">
      <template v-for="(item, index) in regionList" :key="index">
        <div
          class="col-12 sm:col-6 xl:col-4 rounded-[24px] blur-bgc p-[1px]">
          <div class="h-full flex-col-between">
            <div
              class="py-[8px] px-[16px] bg-gradient-linear-[90deg,#E9F1FE,#95D5FB] dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8] rounded-t-[24px] flex-start text-black dark:text-[#FFF]">
              <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                {{ item.name }}
              </div>
            </div>
            <div class="py-[4px]">
              <div class="flex-1 px-[16px] py-[2px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-if="item.staffs.length > 0">
                  <div class="flex-between min-h-[28px]">
                    <div>
                      员工
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        <n-tag> {{ item.staffs[0].nickname }} </n-tag>
                        <template v-if="item.staffs.length - 1 > 0">
                          <n-tag>+{{ item.staffs.length - 1 }} </n-tag>
                        </template>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex-between min-h-[28px]">
                    <div>
                      员工
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        无
                      </span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="flex-1 px-[16px] py-[2px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-if="item.superiors.length > 0">
                  <div class="flex-between min-h-[28px]">
                    <div>
                      负责人
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        <n-tag> {{ item.superiors[0].nickname }} </n-tag>
                        <template v-if="item.superiors.length - 1 > 0">
                          <n-tag>+{{ item.superiors.length - 1 }} </n-tag>
                        </template>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex-between min-h-[28px]">
                    <div>
                      负责人
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        无
                      </span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="flex-1 px-[16px] py-[2px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-if="item.stores.length > 0">
                  <div class="flex-between min-h-[28px]">
                    <div>
                      门店
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        <n-tag> {{ item.stores[0].name }} </n-tag>
                        <template v-if="item.stores.length - 1 > 0">
                          <n-tag>+{{ item.stores.length - 1 }} </n-tag>
                        </template>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex-between min-h-[28px]">
                    <div>
                      门店
                    </div>
                    <div class="text-align-end w-[60%]">
                      <span class="mr-[4px]">
                        无
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="bg-[#F3F5FE] dark:bg-[#F3F5FE1A] rounded-b-[24px] ">
              <div class="flex justify-between">
                <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" @click="emits('deleteRegion', item.id)">
                  <icon name="i-svg:delete" :size="16" />
                </div>
                <div class="flex-between text-size-[14px] ">
                  <div class="px-[20px] h-full flex items-center color-[#3971F3] text-[14px] font-semibold cursor-pointer" @click="emits('getDetail', item.id)">
                    详情
                  </div>
                  <div @click="emits('editRegion', item.id)">
                    <common-button-irregular text="编辑" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </row>
</template>
