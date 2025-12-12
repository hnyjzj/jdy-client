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
  <div class="">
    <n-tabs
      type="segment" animated>
      <n-tab-pane name="chap1" tab="门店">
        <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
          <template v-for="(item, index) in props.stores" :key="index">
            <common-card-info :title=" item.alias || ''" padding="12px">
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
          <common-empty text="暂未分配门店" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="负责人">
        <div class="grid-12 gap-x-[12px]">
          <template v-for="(item, index) in props.super" :key="index">
            <div
              class="rounded-[24px] w-full col-12 p-[1px] " uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
              <common-card-info padding="12px" padding-bottom="12px">
                <template #avatar>
                  <div class="flex items-center" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
                    <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                    <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                      {{ item.nickname || '' }}
                    </div>
                  </div>
                </template>
                <template #info>
                  <div class=" text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                </template>
              </common-card-info>
            </div>
          </template>
        </div>
        <template v-if="props.super.length === 0">
          <common-empty text="暂未分配负责人" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="员工">
        <div class="grid-12 gap-x-[12px]">
          <template v-for="(item, index) in props.list" :key="index">
            <div
              class="rounded-[24px] w-full col-12  p-[1px] " uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
              <common-card-info padding="12px" padding-bottom="12px">
                <template #avatar>
                  <div class="flex items-center" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
                    <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                    <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                      {{ item.nickname || '' }}
                    </div>
                  </div>
                </template>
                <template #info>
                  <div class=" text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                </template>
              </common-card-info>
            </div>
          </template>
        </div>
        <template v-if="props.list.length === 0">
          <common-empty text="暂未分配员工" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="chap4" tab="管理员">
        <div class="grid-12 gap-x-[12px]">
          <template v-for="(item, index) in props.admins" :key="index">
            <div
              class="rounded-[24px] w-full col-12 p-[1px] " uno-lg="col-6" uno-sm="col-12" uno-md="col-12" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
              <common-card-info padding="12px" padding-bottom="12px">
                <template #avatar>
                  <div class="flex items-center" @click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)">
                    <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                    <div class="ml-[8px] font-semibold line-height-[20px] text-size-[14px]">
                      {{ item.nickname || '' }}
                    </div>
                  </div>
                </template>
                <template #info>
                  <div class=" text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
                </template>
              </common-card-info>
            </div>
          </template>
        </div>
        <template v-if="props.admins.length === 0">
          <common-empty text="暂未分配管理员" />
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
    :deep(.n-tabs-nav) {
  width: 300px;
}
</style>
