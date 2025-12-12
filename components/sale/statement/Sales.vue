<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: orderInfoProducts[]
  where: Where<StatementWhere>
  finishedWhere: Where<ProductFinisheds>
  oldWhere: Where<ProductOlds>
}>()

const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/sales/order?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-x-[16px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <common-card-list
        :title="`编号:${item.id}`"
        :tag-text="props.where.status?.preset[item.status]"
        :status="item.status"
        :status-map="OrderStatusColor"
      >
        <template #info>
          <div class="info">
            <common-cell label="开单时间" :value="formatTimestampToDateTime(item.order.created_at) || '--'" />
            <common-cell label="关联销售单" :value="item.order_id || '--'" />
            <common-cell label="门店" :value="item.store.name || '--'" />
            <common-cell label="会员" :value="item.member?.name || '--'" />
            <common-cell label="会员手机号" :value="item.member?.phone || '--'" />
            <common-cell label="主销导购" :value="item.order?.clerks[0].salesman?.nickname || '--'" />
            <common-cell label="产品类型" :value="returnType(item.type) || '--'" />
            <template v-if="item.type === 1">
              <common-cell label="货品名称" :value="item.finished.product?.name || '--'" />
              <common-cell label="成品条码" :value="item.finished.product?.code || '--'" />
              <common-cell label="所属大类" :value="props.finishedWhere?.class?.preset[item.finished.product?.class] || '--'" />
              <common-cell label="零售方式" :value="realtype(item.finished.product?.retail_type) || '--'" />
              <common-cell label="金重" :value="item.finished.product?.weight_metal || '--'" />
              <common-cell label="金价" :value="item.finished?.price_gold || '--'" />
              <common-cell label="标签价" :value="item.finished.product?.label_price || '--'" />
              <common-cell label="原价" :value="item.finished.price_original || '--'" />
              <common-cell label="应付金额" :value="item.finished.price || '--'" />
            </template>
            <template v-if="item.type === 2">
              <common-cell label="货品名称" :value="item.old.product?.name || '--'" />
              <common-cell label="旧料编号" :value="item.old.product?.code || '--'" />
              <common-cell label="成品条码" :value="item.old.product?.code_finished || '--'" />
              <common-cell label="所属大类" :value="props.oldWhere?.class?.preset[item.old.product?.class] || '--'" />
              <common-cell label="回收类型" :value="props.oldWhere.recycle_type?.preset[item.old.product?.recycle_type] || '--'" />
              <common-cell label="金重" :value="item.old.product?.weight_metal || '--'" />
              <common-cell label="回收金价" :value="item.old.product?.recycle_price_gold || '--'" />
              <common-cell label="标签价" :value="item.old.product?.label_price || '--'" />
              <common-cell label="旧料抵扣" :value="item.old.recycle_price || '--'" />
            </template>
            <template v-if="item.type === 3">
              <common-cell label="货品名称" :value="item.accessorie?.product?.name || '--'" />
              <common-cell label="标签价" :value="item.accessorie?.product?.price || '--'" />
              <common-cell label="数量" :value="item.accessorie?.quantity || '--'" />
              <common-cell label="原价" :value="item.accessorie?.price_original || '--'" />
              <common-cell label="应付金额" :value="item.accessorie?.price || '--'" />
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex-end">
            <common-button-rounded padding="4px 36px" content="详情" @button-click="handleClick(item.order_id)" />
          </div>
        </template>
      </common-card-list>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px]';

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
