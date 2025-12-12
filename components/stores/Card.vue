<script setup lang="ts">
const emits = defineEmits<{
  getDetail: [val: string]
  editStore: [val: string]
  deleteStore: [val: string]
}>()
const { storesList } = storeToRefs(useStores())
// 转换省市区名字 toProvinces

const delTips = (id: string) => {
  emits('deleteStore', id)
}
</script>

<template>
  <common-layout-center>
    <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
      <template v-for="(item, index) in storesList" :key="index">
        <common-card-list :title="item.name">
          <template #info>
            <div class="flex-1 py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
              <common-cell label="别名" :value="item.alias" />
              <common-cell label="所属区域" :value="item.region?.name" />
              <common-cell label="联系电话" :value="item.phone" />
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
                <div class="flex-between min-h-[28px] pb-[4px]">
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
            </div>
          </template>
          <template #footer>
            <div class="flex-between">
              <div class="cursor-pointer flex gap-[6px]" @click="delTips(item.id as string)">
                <icon name="i-svg:delete" :size="16" />
                <span class="color-[#F82F2F]">删除</span>
              </div>
              <div class="text-size-[14px] col-6 offset-6" uno-sm="col-7 offset-5" uno-xl="col-7 offset-5">
                <common-button-rounded content="编辑" padding="4px 36px" @button-click="emits('getDetail', item.id)" />
              </div>
            </div>
          </template>
        </common-card-list>
      </template>
    </div>
  </common-layout-center>
</template>
