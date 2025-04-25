<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: DepositOrderInfo[]
  where: Where<OrderWhere>
}>()

const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/deposit/order?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="`定金单号:${item.id}`">
        <template #info>
          <div class="info">
            <common-cell label="所属门店" :value="item.store.name || '--'" />
            <common-cell label="会员" :value="item.member.name || '--'" />
            <common-cell label="会员手机" :value="item.member.phone || '--'" />
            <common-cell label="主销" :value="item.clerk.nickname || '--'" />
            <common-cell label="定金金额" :value="item.price || '--'" />
            <div class="border-b-solid border-b-[#E0E0E0] border" />
            <common-cell label="货品" value="" />
            <template v-for="(ele, i) in item.products" :key="i">
              <common-cell :label="ele.product_finished?.name || '--'" :value="ele.product_finished?.code || '--'" />
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex-end  bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <common-button-irregular text="查看详情" @click="handleClick(item.id)" />
          </div>
        </template>
      </sale-cards>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px] px-[16px]';

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
