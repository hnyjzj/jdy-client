<script setup lang="ts">
// 维修单列表
const props = defineProps<{
  info: SalesSlip[]
}>()

const emits = defineEmits(['sign', 'cancel', 'info'])
const handleSign = () => {
  emits('sign')
}
const handleCancel = () => {
  emits('cancel')
}
const handleClick = () => {
  emits('info')
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="item.num" :tag-text="item.openType" :info="item">
        <template #info>
          <template v-for="(result, ind) in props.info" :key="ind">
            <div class="grid grid-cols-1 gap-[12px]">
              <div class="info">
                <div class="part">
                  <span class="part-left">所属门店</span>
                  <span class="part-right">{{ result.store.name || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">会员</span>
                  <span class="part-right">{{ result.member.nickname || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">会员手机</span>
                  <span class="part-right">{{ result.member.phone || '--' }}</span>
                </div>
                <div class="part">
                  <span class="part-left">主销</span>
                  <span class="part-right">{{ result.mainSalesman || '--' }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="footer gap-[40px]" uno-lg="gap-[48px]">
            <div class="flex flex-row gap-[24px]">
              <div class="accidental" @click="handleCancel">
                撤销
              </div>
              <div class="accidental" @click="handleSign">
                标记
              </div>
            </div>
            <div class="flex-end">
              <common-button-irregular text="详情" @click="handleClick" />
            </div>
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
.footer {
  --uno: 'flex-end justify-items-center bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]';

  .accidental {
    --uno: 'color-[#3971F3] font-semibold font-size-[14px] dark:color-[#fff]';
  }
}
.info {
  --uno: 'flex flex-col justify-items-center gap-[12px] px-[16px] text-nowrap color-[#3971F3] text-size-[14px] dark:color-[#fff]';

  .part {
    --uno: 'flex-center-between';
    &-left {
      --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
    }
    &-right {
      --uno: 'text-size-[14px] color-[#333] dark:color-[#fff]';
    }
  }
}
</style>
