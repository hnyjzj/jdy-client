<script setup lang="ts">
// 会员卡片
const props = defineProps<{
  memberInfo: Partial<Member>
}>()
const checked = defineModel({ type: Boolean, default: false })

const isSquare = ref(false)
</script>

<template>
  <div class="grid-12">
    <div class="box" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="flex flex-row gap-[12px] items-center px-4 py-2 bg-[#F1F5FE] dark:bg-[rgb(245,245,245,0.1)]">
        <div class="check">
          <common-check v-model="checked" :checked="checked" />
        </div>
        <div class="flex flex-row gap-[8px] items-center">
          <common-avatar v-model:is-square="isSquare" img="" :size="24" rounded="60px" />
          <div class="text-[14px] font-semibold color-[#1B2129] dark:color-[#fff]">
            {{ props.memberInfo.nickname }}
          </div>
        </div>
      </div>
      <div class="info grid grid-rows-3 grid-flow-col gap-2 px-4 pt-3 pb-4" uno-sm="grid-cols-2" uno-md="grid-cols-2">
        <div class="vessel">
          <span class="left">昵称</span>
          <span class="right">{{ props.memberInfo.nickname }}</span>
        </div>
        <div class="vessel">
          <span class="left">生日</span>
          <span class="right">{{ props.memberInfo.birthday || '--' }}</span>
        </div>
        <div class="vessel">
          <span class="left">手机号</span>
          <span class="color-[#3971F3] dark:text-[#6EA6FF]">{{ props.memberInfo.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col col-12 bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] rounded-[24px] overflow-hidden border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)]';
}
.vessel {
  --uno: 'flex flex-row items-center gap-2 text-[14px] font-medium';

  .left {
    --uno: 'color-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'color-[#333333] dark:color-[#FFFFFF]';
  }
}
</style>
