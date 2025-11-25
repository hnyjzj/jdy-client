<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: StatementRefundInfo[]
  where: Where<StatementRefundWhere>
}>()

const handleClick = (id?: string, type?: StatementRefundInfo['order_type']) => {
  if (!id) {
    return
  }
  switch (type) {
    // 普通订单
    case OrderTypeSales.OrderTypeSale:
      navigateTo(`/sale/sales/order?id=${id}`)
      break
    // 订金单
    case OrderTypeSales.OrderTypeDeposit:
      navigateTo(`/sale/deposit/order?id=${id}`)
      break
    // 维修单
    case OrderTypeSales.OrderTypeRepair:
      navigateTo(`/sale/service/info?id=${id}`)
      break
    // 其他订单
    case OrderTypeSales.OrderTypeOthers:
      navigateTo(`/sale/other/add?id=${id}`)
      break
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="`退货单编号:${item.id}`">
        <template #info>
          <div class="info">
            <common-cell label="关联销售单" :value="item.order_id || '--'" />
            <common-cell label="门店" :value="item.store.name || '--'" />
            <common-cell label="产品类型" :value="returnType(item.type) || '--'" />
            <common-cell label="产品条码" :value="item.code || '--'" />
            <common-cell label="会员" :value="item.member?.name || '--'" />
            <common-cell label="会员手机号" :value="item.member?.phone || '--'" />
            <common-cell label="货品名称" :value="item.name || '--'" />
            <common-cell label="退货备注" :value="item.remark || '--'" />
            <common-cell label="数量" :value="item.quantity || '--'" />
            <common-cell label="实退金额" :value="item.price || '--'" />
            <common-cell label="应退金额" :value="item.price_original || '--'" />
          </div>
        </template>
        <template #footer>
          <div class="flex-between bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <div class="color-[#4287F4] cursor-pointer flex justify-center items-center" />
            <template v-if="item.order_type !== OrderTypeSales.OrderTypeReturn">
              <common-button-irregular text="查看详情" @click="handleClick(item.order_id, item.order_type)" />
            </template>
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
