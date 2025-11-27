<script setup lang="ts">
const props = defineProps<{
  admins: Staff[]
  super: Staff[]
  list: Staff[]
  stores: Stores[]
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
          <div class="w-[200px] mb-[12px]" />
        </div>
        <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
          <template v-for="(item, index) in props.stores" :key="index">
            <common-card-info :title=" item.alias || ''">
              <template #info>
                <div>
                  <div class=" p-[4px] grid-12">
                    <div class="col-6">
                      门店名称
                    </div>
                    <div class="text-align-end col-6">
                      <div class="break-words">
                        {{ item.name || '暂无' }}
                      </div>
                    </div>
                  </div>
                  <div class=" p-[4px] grid-12">
                    <div class="col-6">
                      电话
                    </div>
                    <div class="text-align-end col-6">
                      <div class="break-words">
                        {{ item.phone || '暂无' }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </common-card-info>
          </template>
        </div>
        <template v-if="props.stores.length === 0">
          <common-emptys text="暂未分配门店" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="负责人">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]" />
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.super" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]" uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
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
                  <div />
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
        <template v-if="props.super.length === 0">
          <common-emptys text="暂未分配负责人" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="员工">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]" />
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.list" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]"
              uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
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
                  <div />
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
        <template v-if="props.list.length === 0">
          <common-emptys text="暂未分配员工" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap4" tab="管理员">
        <div class="flex justify-center items-center">
          <div class="w-[200px] mb-[12px]" />
        </div>
        <div class="grid-12 gap-[8px]">
          <template v-for="(item, index) in props.admins" :key="index">
            <div
              class="rounded-[24px] w-full col-12 blur-bgc p-[1px] mb-[12px]"
              uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
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
                  <div />
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
        <template v-if="props.admins.length === 0">
          <common-emptys text="暂未分配管理员" />
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
