<script setup lang="ts">
const props = defineProps<{
  super: Staff[]
  list: Staff[]
  stores: Stores[]

}>()
const emits = defineEmits<{
  deleteRegionStaff: [val: string, index: number]
  deleteRegionSuper: [val: string, index: number]
  deleteRegionStore: [val: string, index: number]
  confirm: [val: 'store' | 'superior' | 'staff']
}>()

const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
</script>

<template>
  <div class="mt-[12px]">
    <n-tabs
      type="segment" animated>
      <n-tab-pane name="chap1" tab="门店">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]">
            <common-button-rounded content="添加门店" @button-click="emits('confirm', 'store')" />
          </div>
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.stores" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]" uno-lg="col-6" uno-sm="col-12" uno-md="col-12">
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
                      {{ item.name || '' }}
                    </div>
                  </div>
                  <div>
                    <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" @click="emits('deleteRegionStore', item.id as string, index)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                </div>
                <div class=" px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                  <div class="flex-between p-[4px] grid-12">
                    <div class="col-6">
                      门店省市区
                    </div>
                    <div class="text-align-end col-6">
                      {{ item.address || '未设置' }}
                    </div>
                  </div>
                  <div class=" p-[4px] grid-12">
                    <div class="col-6">
                      电话
                    </div>
                    <div class="text-align-end col-6">
                      <div class="break-words">
                        {{ item.contact || '暂无' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="负责人">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]">
            <common-button-rounded content="添加负责人" @button-click="emits('confirm', 'superior')" />
          </div>
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.super" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]" uno-lg="col-6" uno-sm="col-12" uno-md="col-12">
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
                    <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                    <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                      {{ item.nickname || '' }}
                    </div>
                  </div>
                  <div>
                    <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" @click="emits('deleteRegionSuper', item.id as string, index)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                </div>
                <div class=" px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                  <div class="flex-between p-[4px] grid-12">
                    <div class="col-6">
                      手机号
                    </div>
                    <div class="text-align-end col-6">
                      {{ item.phone || '未设置' }}
                    </div>
                  </div>
                  <div class=" p-[4px] grid-12">
                    <div class="col-6">
                      email
                    </div>
                    <div class="text-align-end col-6">
                      <div class="break-words">
                        {{ item.email || '暂无' }}
                      </div>
                    </div>
                  </div>
                  <div class="flex-between p-[4px]">
                    <div class="">
                      性别
                    </div>
                    <div class="text-align-end">
                      {{ sex(item.gender) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="员工">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]">
            <common-button-rounded content="添加员工" @button-click="emits('confirm', 'staff')" />
          </div>
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.list" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]" uno-lg="col-6" uno-sm="col-12" uno-md="col-12">
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
                    <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                    <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                      {{ item.nickname || '' }}
                    </div>
                  </div>
                  <div>
                    <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" @click="emits('deleteRegionStaff', item.id as string, index)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                </div>
                <div class=" px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                  <div class="flex-between p-[4px] grid-12">
                    <div class="col-6">
                      手机号
                    </div>
                    <div class="text-align-end col-6">
                      {{ item.phone || '未设置' }}
                    </div>
                  </div>
                  <div class=" p-[4px] grid-12">
                    <div class="col-6">
                      email
                    </div>
                    <div class="text-align-end col-6">
                      <div class="break-words">
                        {{ item.email || '暂无' }}
                      </div>
                    </div>
                  </div>
                  <div class="flex-between p-[4px]">
                    <div class="">
                      性别
                    </div>
                    <div class="text-align-end">
                      {{ sex(item.gender) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.n-tabs-nav) {
//   width: 300px;
// }
</style>
