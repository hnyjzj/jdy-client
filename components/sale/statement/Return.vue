<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: StatementRefundInfo[]
  where: Where<StatementRefundWhere>
}>()

const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/sales/order?id=${id}`)
}

const returnType = (number: number) => {
  if (number === 1) {
    return '成品'
  }
  if (number === 2) {
    return '旧料'
  }
  return '配件'
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
            <common-cell label="顾客" :value="item.member?.name || '--'" />
            <common-cell label="顾客手机号" :value="item.member?.phone || '--'" />
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
            <common-button-irregular text="查看详情" @click="handleClick(item.order_id)" />
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
