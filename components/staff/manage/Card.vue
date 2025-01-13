<script setup lang="ts">
const props = defineProps<{
  list: Staff[]
}>()
const emits = defineEmits<{
  getDetail: [val: string]
  edit: [val: string]
  delete: [val: string]
}>()

const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
</script>

<template>
  <row>
    <div class="col-12 lg:col-8 lg:offset-2 grid-12 gap-[24px]">
      <template v-for="(item, index) in props.list" :key="index">
        <div
          class="col-12 sm:col-6 xl:col-4 rounded-[24px] blur-bgc p-[1px]">
          <div class="h-full flex-col-between">
            <div
              class="py-[8px] px-[16px] bg-gradient-linear-[90deg,#E9F1FE,#95D5FB] dark:bg-gradient-linear-[90deg,#23324B01,#2A3E5F01,#70B8E8] rounded-t-[24px] flex-start text-black dark:text-[#FFF]">
              <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
              <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                {{ item.nickname || '' }}
              </div>
            </div>
            <div class="flex-1 px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                  {{ item.email || '暂无' }}
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
            <div class="bg-[#F3F5FE] dark:bg-[#F3F5FE1A] rounded-b-[24px] ">
              <div class="grid-12">
                <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer">
                  <icon name="i-svg:delete" size="16" />
                </div>
                <div class="flex-between text-size-[14px] col-6 offset-6" uno-sm="col-7 offset-5" uno-xl="col-7 offset-5">
                  <div class="px-[12px] h-full flex items-center color-[#3971F3] text-[14px] font-semibold cursor-pointer" @click="emits('getDetail', item?.id || '')">
                    详情
                  </div>
                  <div>
                    <common-button-irregular text="操作" />
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
