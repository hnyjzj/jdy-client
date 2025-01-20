<script setup lang="ts">
// 成品列表-详情
const props = defineProps<{
  infoDetail: Staff
}>()
const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}
</script>

<template>
  <div class="w-full" uno-md="w-50%" uno-sm="w-50%" uno-lg="w-40%">
    <div class="w-auto bg-white blur-bga rounded-[24px] border-solid border-[#EFF0F6] col-12 overflow-hidden">
      <div class="rounded-[24px]">
        <common-gradient :title="props.infoDetail?.nickname">
          <template #body>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  头像
                </div>
                <div>
                  <img :src="ImageUrl(props.infoDetail?.avatar)" mode="asc" class="w-auto max-w-[150px] h-[100px]">
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  手机号码
                </div>
                <div class="color-[#333333] max-w-[60%] dark:color-[#fff]">
                  {{ props.infoDetail.phone }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  email
                </div>
                <div class="color-[#333333] max-w-[60%] dark:color-[#fff]">
                  {{ props.infoDetail.email }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  性别
                </div>
                <div class="color-[#333333] dark:color-[#fff]">
                  {{ sex(props.infoDetail.gender) }}
                </div>
              </div>
            </div>
            <div class="flex flex-col px-4 py-[6px]">
              <div class="flex-center-between text-sm font-normal even:bg-[#F5F5F5]">
                <div class="color-[#666666] dark:color-[#fff]">
                  是否禁用
                </div>
                <div class="color-[#333333] dark:color-[#fff]">
                  {{ props.infoDetail?.is_disabled ? '是' : '否' }}
                </div>
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </div>
</template>
