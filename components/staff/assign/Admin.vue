<script setup lang="ts">
const props = defineProps<{
  list: Superior[]
}>()

const emits = defineEmits<{
  deleteStoreStaff: [val: string, index: number]
  confirm: [val: string]
}>()
const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
</script>

<template>
  <div class="p-[16px] pb-0 flex-between">
    <div class="text-[16px] font-semibold">
      管理员
    </div>
    <div>
      <common-button-rounded content="分配管理员" @button-click="emits('confirm', 'admin')" />
    </div>
  </div>
  <div class="grid-12 gap-[16px] py-[16px] ">
    <template v-for="(item, index) in props.list" :key="index">
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
              <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
              <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                {{ item.nickname || '' }}
              </div>
            </div>
            <div>
              <div class="py-[8px] px-[16px] col-2 flex-center-row cursor-pointer" @click="emits('deleteStoreStaff', item.id as string, index)">
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
</template>
