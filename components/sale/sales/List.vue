<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: Orders[]
}>()

const emits = defineEmits<{
  userClick: [id: string]
}>()
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  emits('userClick', id)
}
enum OrderType {
  // 销售单
  Sale = 1,
  //   定金单
  Deposit = 2,
  // 维修单
  Maintenance = 3,
  //   其他
  Other = 4,
}

const showType = (type: number) => {
  switch (type) {
    case OrderType.Sale:
      return '销售单'
    case OrderType.Deposit:
      return '定金单'
    case OrderType.Maintenance:
      return '维修单'
    case OrderType.Other:
      return '其他'
    default:
      return ''
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="item.id" :tag-text="showType(item.type || 0)">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <div class="part">
                <span class="part-left">所属门店</span>
                <span class="part-right">{{ item.store.name || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员</span>
                <span class="part-right">{{ item.member?.nickname || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">会员手机</span>
                <span class="part-right">{{ item.member?.phone || '--' }}</span>
              </div>
              <div class="part">
                <span class="part-left">收银员</span>
                <span class="part-right">{{ item.cashier?.nickname || '--' }}</span>
              </div>
            </div>
          </div>
          <div class="flex-end bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <common-button-irregular text="查看详情" @click="handleClick(item.id)" />
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
