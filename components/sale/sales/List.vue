<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: OrderInfo[]
  where: Where<OrderWhere>
}>()
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/sales/order?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <sale-cards :title="`销售单号:${item.id}`" :tag-text="props.where.status?.preset[item.status]">
        <template #info>
          <div class="info">
            <common-cell label="所属门店" :value="item.store.name || '--'" />
            <common-cell label="会员" :value="item.member?.nickname || '--'" />
            <common-cell label="会员手机" :value="item.member?.phone || '--'" />
            <common-cell label="主销" :value="item?.clerks.find(ele => ele.is_main)?.salesman?.nickname || '--'" />
            <common-cell label="货品信息" :value="item?.products[0].finished?.product?.name || '--'" />
            <common-cell label="实付金额" format="￥" :value="item.price_pay" />
            <common-cell label="货品金额" format="￥" :value="item.product_finished_price" />
            <common-cell label="优惠金额" format="￥" :value="item.price_discount" />
            <common-cell label="旧料抵扣" format="￥" :value="item.product_old_price" />
            <common-cell label="积分" :value="item.integral" />
            <common-cell label="销售时间" :value="formatISODate(item.created_at)" />
          </div>
        </template>
        <template #footer>
          <div class="flex-between bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <div class="" />
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
