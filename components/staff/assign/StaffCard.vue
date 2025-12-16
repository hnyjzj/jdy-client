<script setup lang="ts">
const props = defineProps<{
  /** 员工列表 */
  list: Array<Staff | Superior>
  /** 卡片标题 */
  title: string
  /** 按钮文本 */
  buttonText: string
  /** 按钮点击事件类型 */
  buttonType: 'staff' | 'admin' | 'superior'
}>()

/**
 * 格式化性别显示
 * @param val 性别代码
 * @returns 格式化后的性别文本
 */
const formatGender = (val: number): string => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
</script>

<template>
  <div>
    <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
      <template v-for="(item, index) in props.list" :key="index">
        <div class="">
          <common-card-info padding="12px" padding-bottom="12px">
            <template #top>
              <div class="flex items-center h-full">
                <common-avatar :size="24" rounded="4px" :img="ImageUrl(item.avatar)" />
                <div class="ml-[8px] font-semibold text-size-[14px]">
                  {{ item.nickname || '' }}
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex-end text-size-[14px]">
                <div>
                  <common-button-rounded
                    padding="4px 36px"
                    content="详情" @button-click="navigateTo(`/manage/staffs/staff/info?id=${item.id}`)"
                  />
                </div>
              </div>
            </template>
            <template #info>
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
                  {{ formatGender(item.gender) }}
                </div>
              </div>
            </template>
          </common-card-info>
        </div>
      </template>
    </div>
    <template v-if="props.list.length === 0">
      <common-empty :text="`暂未分配${props.title}`" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
/* 组件样式 */
</style>
