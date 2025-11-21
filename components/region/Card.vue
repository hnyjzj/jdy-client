<script setup lang="ts">
const emits = defineEmits<{
  getDetail: [val: string]
  editRegion: [val: string]
  deleteRegion: [val: string]
}>()
const { regionList } = storeToRefs(useRegion())
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in regionList" :key="index">
      <common-card-list :title="item.name">
        <template #info>
          <div class="py-[8px]">
            <common-cell label-color="#000" label="别名" :value="item.alias" />
            <div class="flex-1 text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-if="item.stores.length > 0">
                <div class="flex-between min-h-[28px]">
                  <div>
                    门店
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
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
                    <span>
                      无
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="flex-1 py-[2px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-if="item.staffs.length > 0">
                <div class="flex-between min-h-[28px]">
                  <div>
                    员工
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span class="">
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
                    <span class="">
                      无
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="flex-1 py-[2px]  text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
              <template v-else>
                <div class="flex-between min-h-[28px]">
                  <div>
                    负责人
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
                      无
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="flex-1 py-[2px]  text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <template v-if="item.admins.length > 0">
                <div class="flex-between min-h-[28px]">
                  <div>
                    管理员
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
                      <n-tag> {{ item.admins[0].nickname }} </n-tag>
                      <template v-if="item.admins.length - 1 > 0">
                        <n-tag>+{{ item.admins.length - 1 }} </n-tag>
                      </template>
                    </span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex-between min-h-[28px]">
                  <div>
                    管理员
                  </div>
                  <div class="text-align-end w-[60%]">
                    <span>
                      无
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex-between">
            <div class="cursor-pointer pl-[16px]" @click="emits('deleteRegion', item.id)">
              <icon name="i-svg:delete" :size="16" />
            </div>
            <div class="text-size-[14px] col-6 offset-6" uno-sm="col-7 offset-5" uno-xl="col-7 offset-5">
              <common-button-rounded content="编辑" padding="4px 36px" @button-click="emits('getDetail', item.id)" />
            </div>
          </div>
        </template>
      </common-card-list>
    </template>
  </div>
</template>
