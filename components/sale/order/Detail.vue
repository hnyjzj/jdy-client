<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  orders: OrderInfo
  orderWhere: Where<OrderWhere>
  memberFiler: Where<Member>
  productFilter: Where<ProductFinisheds>
  oldFilter: Where<ProductOlds>
  returnGoods: (req: ReturnGoods) => Promise<boolean>
  identity: number
  store: string
  partFilter: Where<ProductAccessories>
}>()

const payMethods = (val: number) => {
  const arrary = optonsToSelect(props.orderWhere.payment_method?.preset)
  const data = arrary.find(item => item.value === val)
  return data?.label || '未知'
}

const route = useRoute()

// 计算成品列表加的积分
const productListScore = computed(() => {
  const total = ref(0)
  if (props.orders.products?.length) {
    total.value = props.orders.products.reduce((total, item) => {
      return calc('(t + i) | <=0,!n', { t: total, i: item.type === 1 ? item.finished.integral : 0 || 0 })
    }, 0)
  }
  return total.value
})
// 计算旧料列表 减的积分
const masterListScore = computed(() => {
  const total = ref(0)
  if (props.orders.products?.length) {
    total.value = props.orders.products.reduce((total, item) => {
      return calc('(t + i) | <=0,!n', { t: total, i: item.type === 2 ? item.old.integral : 0 || 0 })
    }, 0)
  }
  return total.value
})
// 配件积分
const PartsListScore = computed(() => {
  const total = ref(0)
  if (props.orders.products?.length) {
    total.value = props.orders.products.reduce((total, item) => {
      return calc('(t + i ) | <=0,!n', { t: total, i: item.type === 3 ? item.accessorie?.integral : 0 || 0 })
    }, 0)
  }
  return total.value
})

// 总积分计算
const totalScore = computed(() => {
  return calc('(a - b + c) | =0,!n', {
    a: productListScore.value,
    b: masterListScore.value,
    c: PartsListScore.value,
  })
})

// 成品退货
const returnGoodsRef = ref()
const onReturnProduct = async (index: number) => {
  await returnGoodsRef.value?.setPrice(index)
}
</script>

<template>
  <div class="grid-12 gap-[12px]">
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <sale-cards title="基本信息">
        <template #info>
          <div class="info">
            <common-cell label="门店" :value="props.orders?.store?.name" rcol="col-8" lcol="col-4" />
            <common-cell label="订单编号" :value="props.orders.id" rcol="col-8" lcol="col-4" />
            <common-cell label="订单状态" :value="props.orderWhere.status?.preset[props.orders.status]" val-color="#FF9900" />
            <common-cell label="订单来源" :value="props.orderWhere.source?.preset[props.orders.source]" />
            <common-cell label="销售时间" :value="formatISODate(props.orders.created_at)" />
            <div class="line" />
            <common-cell label="会员姓名" :value="props.orders.member?.name || ''" />
            <common-cell label="会员昵称" :value="props.orders.member?.nickname || ''" />
            <common-cell label="手机号" :value="props.orders.member?.phone" />
            <common-cell label="会员等级" :value="props.orders.member?.level" />
            <template v-if="props.orders?.order_deposits?.length">
              <div class="line" />
              <common-cell label="关联订金单" value="" label-color="#4C8DF6" />
              <template v-for="(deposit, ix) in props.orders.order_deposits" :key="ix">
                <common-cell label="订金单号" :value="deposit.id" label-color="#4C8DF6" />
                <common-cell label="订金金额" :value="deposit.price" />
                <template v-for="(p, index) in deposit.products" :key="index">
                  <common-cell :label="`商品${index + 1}`" :value="p.product_finished.name" />
                </template>
              </template>
            </template>
          </div>
        </template>
      </sale-cards>
    </div>
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <sale-cards title="店员信息">
        <template #info>
          <div class="info">
            <common-cell label="收银员" :value="props.orders.cashier?.nickname" />
            <common-cell label="手机号" :value="props.orders.cashier?.phone" />
            <template v-for="(item, index) in props.orders.clerks" :key="index">
              <div class="line" />
              <common-cell label="导购员" :value="item.salesman?.nickname || ''" />
              <common-cell label="手机号" :value="item.salesman?.phone" />
              <common-cell label="业绩比例" :value="item.performance_rate || ''" right="%" />
              <common-cell label="是否主销" :value="item.is_main" />
            </template>
          </div>
        </template>
      </sale-cards>
    </div>
    <template v-for="(obj, i) in props.orders.products" :key="i">
      <template v-if="obj.type === 1">
        <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
          <sale-cards title="成品信息">
            <template #info>
              <div class="info">
                <template v-if="obj.finished.product?.images?.length">
                  <div class="flex overflow-x-auto">
                    <n-image-group>
                      <template v-for="(img, index) in obj.finished.product.images" :key="index">
                        <n-image
                          :src="ImageUrl(img)"
                          width="100"
                          height="100"
                          class="shrink-0 p-1"
                        />
                      </template>
                    </n-image-group>
                  </div>
                </template>
                <common-cell label="商品条码" :value="obj.finished.product?.code" />
                <common-cell label="商品名称" :value="obj.finished.product?.name" val-color="#4C8DF6" />
                <common-cell label="零售方式" :value="props.productFilter.retail_type?.preset[(obj.finished.product?.retail_type as number)]" />
                <common-cell label="材质" :value="props.productFilter.material?.preset[(obj.finished.product?.material as number)]" />
                <common-cell label="成色" :value="props.productFilter.quality?.preset[(obj.finished.product?.quality as number)]" />
                <common-cell label="主石" :value="props.productFilter.gem?.preset[(obj.finished.product?.gem as number)]" />
                <common-cell label="主石重(ct)" :value="obj.finished.product?.weight_gem" />
                <common-cell label="品类" :value="props.productFilter.category?.preset[obj.finished.product?.category!] " />
                <common-cell label="品牌" :value="props.productFilter.brand?.preset[obj.finished.product?.brand!] " />
                <common-cell label="工艺" :value="props.productFilter.craft?.preset[(obj.finished.product?.craft as number)]" />
                <common-cell label="金重(g)" :value="obj.finished.product?.weight_metal" />
                <common-cell label="金价(元/g)" format="￥" :value="obj.finished.price_gold" />
                <common-cell label="工费" format="￥" :value="obj.finished.labor_fee" />
                <common-cell label="标签价" format="￥" :value="obj.finished.product?.label_price" />
                <common-cell label="折扣" :value="obj.finished.discount_final" right="%" />
                <common-cell label="固定折扣" :value="obj.finished.discount_fixed" right="%" />
                <common-cell label="会员折扣" :value="obj.finished.discount_member" right="%" />
                <common-cell label="积分抵扣" :value="obj.finished.integral_deduction" />
                <common-cell label="抹零" format="￥" :value="obj.finished.round_off" />
                <common-cell label="积分(+)" :value="obj.finished.integral" />
                <common-cell label="应付金额" format="￥" :value="obj.finished.price" />
                <template v-if="obj.status === OrderStatusText.OrderSalesProductStatusReturn">
                  <common-cell label="成品状态" value="已退货" val-color="#FF9900" />
                </template>
                <div class="flex-end">
                  <template v-if="obj.status === OrderStatusText.OrderSalesProductStatusComplete && props?.identity > 1 && props.store === orders.store_id && !route.query.embedded">
                    <common-button-rounded content="退货" @button-click="onReturnProduct(i)" />
                  </template>
                </div>
                <div class="line" />
              </div>
            </template>
          </sale-cards>
        </div>
      </template>

      <template v-if="obj.type === 2">
        <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
          <sale-cards title="旧料信息">
            <template #info>
              <div class="info">
                <template v-if="obj.old?.product?.images?.length">
                  <n-image-group>
                    <div class="flex overflow-x-auto">
                      <template v-for="(img, index) in obj.old.product.images" :key="index">
                        <n-image
                          :src="ImageUrl(img)"
                          width="100"
                          height="100"
                          class="shrink-0 p-1"
                        />
                      </template>
                    </div>
                  </n-image-group>
                </template>
                <common-cell label="旧料名称" :value="obj.old?.product?.name " val-color="#4C8DF6" />
                <common-cell label="旧料编号" :value="obj?.old.product_id" />
                <common-cell label="旧料条码" :value="obj?.old.product?.code " />
                <common-cell label="本店货品" :value="obj.old.product?.is_our" />
                <common-cell label="回收方式" :value="props.oldFilter.recycle_method?.preset[obj.old.product?.recycle_method!] " />
                <common-cell label="回收类型" :value="props.oldFilter.recycle_type?.preset[obj.old.product?.recycle_type!] " />
                <common-cell label="兑换成品" :value="obj.old?.product?.exchange_finisheds?.length ? obj.old?.product?.exchange_finisheds?.join(',') : '无'" />
                <common-cell label="材质" :value="props.oldFilter.material?.preset[obj.old.product?.material!] " />
                <common-cell label="成色" :value="props.oldFilter.quality?.preset[obj.old.product?.quality!] " />
                <common-cell label="实际成色" :value="obj.old.quality_actual" />
                <common-cell label="主石" :value="props.oldFilter.gem?.preset[obj.old.product?.gem!] " />
                <common-cell label="主石重(ct)" :value="obj.old.product?.weight_gem" />
                <common-cell label="品类" :value="props.oldFilter.category?.preset[obj.old.product?.category!] " />
                <common-cell label="品牌" :value="props.oldFilter.brand?.preset[obj.old.product?.brand!] " />
                <common-cell label="工艺" :value="props.oldFilter.craft?.preset[obj.old.product?.craft!] " />
                <common-cell label="积分(-)" :value="obj.old.integral" />
                <common-cell label="回收工费方式" :value="props.oldFilter.recycle_price_labor_method?.preset[obj.old.recycle_price_labor_method!] " />
                <common-cell label="回收工费" format="￥" :value="obj.old.recycle_price_labor" />
                <common-cell label="回收金价" format="￥" :value="obj.old.recycle_price_gold" />
                <common-cell label="回收金额" format="￥" :value="obj.old.recycle_price" />
                <common-cell label="回收金重(g)" :value="obj.old.weight_metal" />
                <template v-if="obj.status === OrderStatusText.OrderSalesProductStatusReturn">
                  <common-cell label="状态" value="已退货" val-color="#FF9900" />
                </template>
                <div class="flex-end">
                  <template v-if="obj?.status === OrderStatusText.OrderSalesProductStatusComplete && props?.identity > 1 && props.store === orders.store_id && !route.query.embedded">
                    <common-button-rounded content="退货" @button-click="onReturnProduct(i)" />
                  </template>
                </div>
                <div class="line" />
              </div>
            </template>
          </sale-cards>
        </div>
      </template>
      <template v-if="obj.type === 3">
        <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
          <sale-cards title="配件信息">
            <template #info>
              <div class="grid grid-cols-1 gap-[12px]">
                <div class="info">
                  <common-cell label="配件名称" :value="obj.accessorie?.product?.name" val-color="#4C8DF6" />
                  <common-cell label="配件类型" :value="props.partFilter.type?.preset[obj.accessorie.product?.type!]" val-color="#4C8DF6" />
                  <common-cell label="零售方式" :value="props.partFilter.retail_type?.preset[obj.accessorie.product?.retail_type!]" />
                  <common-cell label="积分" :value="obj.accessorie?.integral" />
                  <common-cell label="应付金额" format="￥" :value="obj.accessorie?.price" />
                  <common-cell label="数量" :value="obj.accessorie.quantity" />
                  <template v-if="obj.status === OrderStatusText.OrderSalesProductStatusReturn">
                    <common-cell label="状态" value="已退货" val-color="#FF9900" />
                  </template>
                  <div class="flex-end">
                    <template v-if="obj?.status === OrderStatusText.OrderSalesProductStatusComplete && props?.identity > 1 && props.store === orders.store_id && !route.query.embedded">
                      <common-button-rounded content="退货" @button-click="onReturnProduct(i)" />
                    </template>
                  </div>
                  <div class="line" />
                </div>
              </div>
            </template>
          </sale-cards>
        </div>
      </template>
    </template>

    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <sale-cards title="结算信息">
        <template #info>
          <div class="info">
            <common-cell label="货品金额" format="￥" :value="props.orders.product_finished_price" />
            <common-cell label="配件礼品" format="￥" :value="props.orders.product_accessorie_price" />
            <common-cell label="旧料抵扣" format="￥" :value="props.orders.product_old_price" />
            <common-cell label="优惠金额" format="￥" :value="props.orders.price_discount" />
            <common-cell label="实付金额" format="￥" :value="props.orders.price_pay" />
            <common-cell label="积分抵扣" :value="props.orders.integral_deduction" />
            <div class="line" />
            <common-cell label="支付方式" value="" label-color="#4C8DF6" />
            <template v-for="(item, index) in props.orders.payments" :key="index">
              <common-cell :label="payMethods(item.payment_method) " label-color="#4C8DF6" val-color="#4C8DF6" format="￥" :value="item.amount" />
            </template>
            <div class="line" />
            <common-cell label="成品积分" format="+" :value="productListScore" label-color="#4C8DF6" val-color="#4C8DF6" />
            <common-cell label="旧料积分" format="-" :value="masterListScore" label-color="#4C8DF6" val-color="#4C8DF6" />
            <common-cell label="配件积分" format="+" :value="PartsListScore" label-color="#4C8DF6" val-color="#4C8DF6" />
            <common-cell label="积分合计" :value="totalScore || props.orders.integral" label-color="#4C8DF6" val-color="#4C8DF6" />
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
          </div>
        </template>
      </sale-cards>
    </div>
    <sale-order-return-goods ref="returnGoodsRef" :where="props.orderWhere" :product-filter="productFilter" :orders="props.orders" :return-goods="props.returnGoods" />
  </div>
</template>

<style lang="scss" scoped>
 .info {
  --uno: 'flex flex-col gap-[3px] px-[16px] pb-[16px]';
}
.line {
  --uno: 'h-[1px] w-full bg-[#E0E0E0] my-[8px]';
}
</style>
