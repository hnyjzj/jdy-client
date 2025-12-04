<script lang="ts" setup>
const props = defineProps<{
  orders: DepositOrderInfo
  where: Where<DepositOrderWhere>
  memberFiler: Where<Member>
  productFilter: Where<ProductFinisheds>
  returnGoods: (val: DepositReturnGoods) => Promise<boolean>
  identity: number
  store: string
}>()
const payMethods = (val: number) => {
  const arrary = optonsToSelect(props.where.payment_method?.preset)
  const data = arrary.find(item => item.value === val)
  return data?.label || '未知'
}
const showModel = ref(false)
const showReturnGoods = ref<{ Finished: DepositOrderInfoProducts, id: string }>()
// 点击退货
const returnGoods = (val: number) => {
  const data = {
    Finished: props.orders.products[val],
    id: props.orders?.id as string,
  }
  showReturnGoods.value = data
  showModel.value = true
}
</script>

<template>
  <div>
    <common-layout-center>
      <div>
        <common-card-info title="订单信息">
          <template #info>
            <div class="info">
              <common-cell label="门店" :value="props.orders.store?.name" />
              <common-cell label="订单编号" :value="props.orders.id" />
              <common-cell label="订单状态" :value="where.status?.preset[(props.orders.status as number)]" val-color="#FF9900" />
              <common-cell label="销售时间" :value="formatISODate(props.orders.created_at)" />
              <div class="flex flex-row justify-between">
                <div class="text-size-[14px] color-[#666] dark:color-[#CBCDD1] dark:color-[#fff]">
                  订单备注
                </div>
                <div class="text-size-[14px] text-end color-[#333] dark:color-[#fff]">
                  <template v-for="(item, index) in props.orders.remarks" :key="index">
                    <div>
                      {{ item }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="border-b-solid border-b-[#E0E0E0] border" />
              <common-cell label="会员姓名" :value="props.orders.member?.name || ''" />
              <common-cell label="会员昵称" :value="props.orders.member?.nickname || ''" />
              <common-cell label="手机号" :value="props.orders.member?.phone" />
              <common-cell label="会员等级" :value="props.orders.member?.level" />
              <div class="border-b-solid border-b-[#E0E0E0] border" />
              <common-cell label="实付金额" format="￥" :value="props.orders.price_pay" />
              <common-cell label="支付方式" value=" " />
              <template v-for="(item, index) in props.orders.payments" :key="index">
                <common-cell :label="payMethods(item.payment_method as number) " format="￥" :value="item.amount" />
              </template>
            </div>
          </template>
        </common-card-info>
      </div>
      <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
        <common-card-info title="店员信息">
          <template #info>
            <div class="info">
              <common-cell label="收银员" :value="props.orders.cashier?.nickname" />
              <common-cell label="手机号" :value="props.orders.cashier?.phone" />
              <common-cell label="主销导购" :value="props.orders.clerk?.nickname || ''" />
              <common-cell label="手机号" :value="props.orders.clerk?.phone" />
            </div>
          </template>
        </common-card-info>
      </div>
      <template v-if="props.orders.products?.length > 0 || false">
        <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
          <common-card-info title="成品信息">
            <template #info>
              <div class="info">
                <template v-for="(item, index) in props.orders.products" :key="index">
                  <template v-if="index !== 0">
                    <div class="border-b-solid border-b-[#E0E0E0] border" />
                  </template>
                  <template v-if="item.is_our">
                    <common-cell label="商品条码" :value="item.product_finished?.code" />
                    <common-cell label="商品名称" :value="item.product_finished?.name" />
                    <common-cell label="零售方式" :value="props.productFilter.retail_type?.preset[item.product_finished?.retail_type] " />
                    <common-cell label="主石重(ct)" :value="item.product_finished?.weight_gem" />
                    <common-cell label="颜色" :value="props.productFilter.color_gem?.preset[item.product_finished?.color_gem] " />
                    <common-cell label="净度" :value="props.productFilter.clarity?.preset[item.product_finished?.clarity] " />
                    <common-cell label="金重(g)" :value="item.product_finished?.weight_metal" />
                    <common-cell label="工费" format="￥" :value="item.product_finished?.labor_fee" />
                    <common-cell label="标签价" format="￥" :value="item.product_finished?.label_price" />
                  </template>
                  <template v-else>
                    <common-cell label="商品名称" :value="item.product_demand?.name" />
                    <common-cell label="零售方式" :value="props.productFilter.retail_type?.preset[item.product_demand?.retail_type as number] " />
                    <common-cell label="主石重(ct)" :value="item.product_demand?.weight_gem" />
                    <common-cell label="颜色" :value="props.productFilter.color_gem?.preset[item.product_demand?.color_gem as number] " />
                    <common-cell label="净度" :value="props.productFilter.clarity?.preset[item.product_demand?.clarity as number] " />
                    <common-cell label="金重(g)" :value="item.product_demand?.weight_metal" />
                    <common-cell label="工费" format="￥" :value="item.product_demand?.labor_fee" />
                    <common-cell label="标签价" format="￥" :value="item.product_demand?.label_price" />
                  </template>
                  <common-cell label="金价(元/g)" format="￥" :value="item.price_gold" />
                  <common-cell label="定金金额" format="￥" :value="item.price" />
                  <template v-if="item.status === DepositOrderStatus.Returned">
                    <common-cell label="货品状态" value="已退款" val-color="#FF9900" />
                    <div class="line" />
                    <template v-for="(refund, i) in props.orders.order_refunds" :key="i">
                      <template v-if="refund.code === item.product_finished.code">
                        <common-cell label="退款时间" :value="formatTimestampToDateTime(item.created_at || '')" />
                        <common-cell label="退款单号" :value="refund.id" />
                        <common-cell label="退款金额" format="￥" :value="refund?.price" />
                        <common-cell label="退货数量" :value="refund?.quantity" />
                        <common-cell label="备注" :value="refund?.remark" />
                      </template>
                    </template>
                  </template>
                  <div class="flex-end">
                    <template v-if="item.status === DepositOrderStatus.Booking && props?.identity > 1 && props.store === orders.store_id">
                      <common-button-rounded content="退款" @button-click="returnGoods(index)" />
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </common-card-info>
        </div>
      </template>

      <sale-deposit-return-goods v-model:show="showModel" :where="props.where" :product-filter="props.productFilter" :show-return-goods="showReturnGoods" :return-goods="props.returnGoods" />
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
 .info {
  --uno: 'flex flex-col gap-[3px] pb-[16px]';
}
.line {
  --uno: 'h-[1px] w-full bg-[#E0E0E0] my-[8px]';
}
</style>
