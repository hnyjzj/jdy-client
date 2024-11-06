<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: SalesSlip[]
}>()

const emits = defineEmits(['userClick'])
const handleClick = () => {
  emits('userClick')
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
          <div class="flex-center-row bg-[#F3F5FE] rounded-b-[24px] px-[16px] py-[8px] dark:bg-[rgba(243,245,254,0.1)]">
            <div class="info color-[#3971F3] text-size-[14px] font-semibold dark:color-[#fff]" @click="handleClick">
              查看详情
            </div>
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[12px] px-[16px]';

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
