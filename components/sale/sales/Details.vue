<script setup lang="ts">
// 销售明细列表
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
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <div class="part">
                <span class="part-left">所属门店</span>
                <span class="part-right">{{ item.store.name || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员</span>
                <span class="part-right">{{ item.member.nickname || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员手机</span>
                <span class="part-right">{{ item.member.phone || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">主销</span>
                <span class="part-right">{{ item.mainSalesman || '--' }}</span>
              </div>
            </div>
          </div>
          <div class="flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <common-button-irregular text="查看详情" @click="handleClick" />
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
