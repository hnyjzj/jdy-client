<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: orderInfoProducts[]
  where: Where<StatementWhere>
}>()

const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/sales/order?id=${id}`)
}

const returnColor = (number: number) => {
  if (number === 1) {
    return 'greyblue'
  }
  if (number === 2) {
    return 'grey'
  }
  if (number === 3) {
    return 'green'
  }
  if (number === 5) {
    return 'red'
  }
  return 'orange'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="`编号:${item.id}`" :tag-text="props.where.status?.preset[item.status]" :bg="returnColor(item.status)">
        <template #info>
          <div class="info">
            <common-cell label="关联销售单" :value="item.order_id || '--'" />
            <common-cell label="门店" :value="item.store.name || '--'" />
            <common-cell label="产品条码" :value="item.code || '--'" />
            <common-cell label="会员" :value="item.member?.name || '--'" />
            <common-cell label="会员手机号" :value="item.member?.phone || '--'" />
            <common-cell label="主销导购" :value="item.order?.clerks[0].salesman?.nickname || '--'" />
            <common-cell label="产品类型" :value="returnType(item.type) || '--'" />
            <template v-if="item.type === 1">
              <common-cell label="货品名称" :value="item.finished.product?.name || '--'" />
              <common-cell label="标签价" :value="item.finished.product?.label_price || '--'" />
            </template>
            <template v-if="item.type === 2">
              <common-cell label="货品名称" :value="item.old.product?.name || '--'" />
              <common-cell label="标签价" :value="item.old.product?.label_price || '--'" />
              <common-cell label="旧料抵扣" :value="item.order?.product_old_price || '--'" />
              <common-cell label="旧料编号" :value="item.old.product?.code || '--'" />
            </template>
            <template v-if="item.type === 3">
              <common-cell label="货品名称" :value="item.accessorie?.product?.category?.name || '--'" />
              <common-cell label="标签价" :value="item.accessorie?.product?.category?.label_price || '--'" />
            </template>
            <common-cell label="应付金额" :value="item.order.price || '--'" />
            <common-cell label="折扣" :value="item.order.price_discount || '--'" />
            <common-cell label="积分" :value="item.order.integral || '--'" />
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
