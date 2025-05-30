<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  orders: OrderInfo
  orderWhere: Where<OrderWhere>
  memberFiler: Where<Member>
  productFilter: Where<ProductFinisheds>
  oldFilter: Where<ProductOlds>
  returnGoods: (req: ReturnGoods) => void

}>()
const payMethods = (val: number) => {
  const arrary = optonsToSelect(props.orderWhere.payment_method?.preset)
  const data = arrary.find(item => item.value === val)
  return data?.label || '未知'
}

// 计算成品列表加的积分
const productListScore = computed(() => {
  const total = ref(0)
  total.value = props.orders.products.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.type === 1 ? item.finished.integral : 0 || 0 })
  }, 0)
  return total.value
})
// 计算旧料列表 减的积分
const masterListScore = computed(() => {
  const total = ref(0)
  total.value = props.orders.products.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.type === 2 ? item.old.integral : 0 || 0 })
  }, 0)
  return total.value
})
// 配件积分
const PartsListScore = computed(() => {
  const total = ref(0)
  total.value = props.orders.products.reduce((total, item) => {
    return calc('(t + i ) | <=0,!n', { t: total, i: item.type === 3 ? item.accessorie?.integral : 0 || 0 })
  }, 0)
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

const showModel = defineModel('dialog', { default: false })
const showReturnGoods = ref({} as {
  goods?: orderInfoProducts
  id: string
})
// 成品退货
const returnGoodsRef = ref()
const onReturnProduct = async (index: number) => {
  const data = {
    goods: props.orders.products[index],
    id: props.orders.id,
  }
  showReturnGoods.value = data
  if (props.orders.products[index].type === 3) {
    await returnGoodsRef.value?.setPrice()
  }
  showModel.value = true
}

function allObjectsContainNumber(targetNumber: number) {
  // 使用 every() 方法确保所有对象都满足条件
  return props.orders.products.every(obj =>
    // 获取对象的所有值并检查是否包含目标数字
    typeof obj.type === 'number' // 1. 字段必须是数字类型[2,7](@ref)
    && obj.type === targetNumber,
  )
}
</script>

<template>
  <div class="grid-12 gap-[12px]">
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
      <sale-cards title="基本信息">
        <template #info>
          <div class="info">
            <common-cell label="订单编号" :value="props.orders.id" rcol="col-8" lcol="col-4" />
            <common-cell label="订单状态" :value="props.orderWhere.status?.preset[props.orders.status]" val-color="#FF9900" />
            <common-cell label="订单来源" :value="props.orderWhere.source?.preset[props.orders.source]" />
            <common-cell label="销售时间" :value="formatISODate(props.orders.created_at)" />
            <div class="line" />
            <common-cell label="会员姓名" :value="props.orders.member?.name || ''" />
            <common-cell label="会员昵称" :value="props.orders.member?.nickname || ''" />
            <common-cell label="手机号" :value="props.orders.member?.phone" />
            <common-cell label="会员等级" :value="props.orders.member?.level" />
            <template v-if="props.orders.order_deposits.length">
              <div class="line" />
              <common-cell label="关联订金单" value="" label-color="#4C8DF6" />
              <template v-for="(deposit, ix) in props.orders.order_deposits" :key="ix">
                <common-cell label="订金单号" :value="deposit.id" label-color="#4C8DF6" />
                <common-cell label="订金金额" :value="deposit.price_pay" />
                <template v-for="(p, index) in deposit.products" :key="index">
                  <common-cell :label="`商品${index + 1}`" :value="p.product_finished.name" />
                </template>
              </template>
            </template>
          </div>
        </template>
      </sale-cards>
    </div>
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
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

    <template v-if="allObjectsContainNumber(1)">
      <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
        <sale-cards title="成品信息">
          <template #info>
            <div class="info">
              <template v-for="(item, index) in props.orders.products" :key="index">
                <template v-if="item.type === 1">
                  <template v-if="index !== 0">
                    <div class="line" />
                  </template>
                  <common-cell label="商品条码" :value="item.finished.product?.code" />
                  <common-cell label="商品名称" :value="item.finished.product?.name" val-color="#4C8DF6" />
                  <common-cell label="零售方式" :value="props.productFilter.retail_type?.preset[(item.finished.product?.retail_type as number)]" />
                  <!-- :value="props.productFilter.retail_type?.preset[item.finished.product_demand?.retail_type as number] " -->
                  <common-cell label="金重(g)" :value="item.finished.product?.weight_gem" />
                  <common-cell label="金价(元/g)" format="￥" :value="item.finished.price_gold" />
                  <common-cell label="工费" format="￥" :value="item.finished.labor_fee" />
                  <common-cell label="标签价" format="￥" :value="item.finished.product?.label_price" />
                  <common-cell label="折扣" :value="item.finished.discount_final" right="%" />
                  <common-cell label="固定折扣" :value="item.finished.discount_fixed" right="%" />
                  <common-cell label="会员折扣" :value="item.finished.discount_member" right="%" />
                  <common-cell label="积分抵扣" :value="item.finished.integral_deduction" />
                  <common-cell label="抹零" format="￥" :value="item.finished.round_off" />
                  <common-cell label="积分(+)" :value="item.finished.integral" />
                  <common-cell label="应付金额" format="￥" :value="item.finished.price" />
                  <template v-if="item.status === OrderStatusText.OrderSalesProductStatusReturn">
                    <common-cell label="成品状态" value="已退货" val-color="#FF9900" />
                  </template>
                  <div class="flex-end">
                    <template v-if="item.status === OrderStatusText.OrderSalesProductStatusComplete">
                      <common-button-rounded content="退货" @button-click="onReturnProduct(index)" />
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </sale-cards>
      </div>
    </template>
    <template v-if="allObjectsContainNumber(2)">
      <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
        <sale-cards title="旧料信息">
          <template #info>
            <div class="info">
              <template v-for="(item, index) in props.orders.products" :key="index">
                <template v-if="item.type === 2">
                  <common-cell label="旧料名称" :value="item.old?.product?.name " val-color="#4C8DF6" />
                  <common-cell label="旧料编号" :value="item?.old.product_id" />
                  <common-cell label="旧料条码" :value="item?.old.product?.code " />
                  <common-cell label="本店货品" :value="item.old.product?.is_our" />
                  <common-cell label="回收方式" :value="props.oldFilter.recycle_method?.preset[item.old.product?.recycle_method!] " />
                  <common-cell label="回收类型" :value="props.oldFilter.recycle_type?.preset[item.old.product?.recycle_type!] " />
                  <common-cell label="材质" :value="props.oldFilter.material?.preset[item.old.product?.material!] " />
                  <common-cell label="成色" :value="props.oldFilter.quality?.preset[item.old.product?.quality!] " />
                  <common-cell label="实际成色" :value="item.old.quality_actual" />
                  <common-cell label="主石" :value="props.oldFilter.gem?.preset[item.old.product?.gem!] " />
                  <common-cell label="主石重(ct)" :value="item.old.product?.weight_gem" />
                  <common-cell label="品类" :value="props.oldFilter.category?.preset[item.old.product?.category!] " />
                  <common-cell label="品牌" :value="props.oldFilter.brand?.preset[item.old.product?.brand!] " />
                  <common-cell label="工艺" :value="props.oldFilter.craft?.preset[item.old.product?.craft!] " />
                  <common-cell label="积分(-)" :value="item.old.integral" />
                  <common-cell label="回收工费方式" :value="props.oldFilter.recycle_price_labor_method?.preset[item.old.recycle_price_labor_method!] " />
                  <common-cell label="回收工费" format="￥" :value="item.old.recycle_price_labor" />
                  <common-cell label="回收金价" format="￥" :value="item.old.recycle_price_gold" />
                  <common-cell label="回收金额" format="￥" :value="item.old.recycle_price" />
                  <template v-if="item.status === OrderStatusText.OrderSalesProductStatusReturn">
                    <common-cell label="状态" value="已退货" val-color="#FF9900" />
                  </template>
                  <div class="flex-end">
                    <template v-if="item?.status === OrderStatusText.OrderSalesProductStatusComplete">
                      <common-button-rounded content="退货" @button-click="onReturnProduct(index)" />
                    </template>
                  </div>
                  <div class="line" />
                </template>
              </template>
            </div>
          </template>
        </sale-cards>
      </div>
    </template>

    <template v-if="allObjectsContainNumber(3)">
      <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
        <sale-cards title="配件信息">
          <template #info>
            <div class="grid grid-cols-1 gap-[12px]">
              <div class="info">
                <template v-for="(item, index) in props.orders.products" :key="index">
                  <template v-if="item.type === 3">
                    <common-cell label="配件名称" :value="item.accessorie?.product?.category.name" val-color="#4C8DF6" />
                    <common-cell label="配件id" :value="item.accessorie?.product?.category.id" />
                    <common-cell label="积分" :value="item.accessorie?.integral" />
                    <common-cell label="应付金额" format="￥" :value="item.accessorie.price" />
                    <common-cell label="数量" :value="item.accessorie.quantity" />
                    <template v-if="item.status === OrderStatusText.OrderSalesProductStatusReturn">
                      <common-cell label="状态" value="已退货" val-color="#FF9900" />
                    </template>
                    <div class="flex-end">
                      <template v-if="item?.status === OrderStatusText.OrderSalesProductStatusComplete">
                        <common-button-rounded content="退货" @button-click="onReturnProduct(index)" />
                      </template>
                    </div>
                    <div class="line" />
                  </template>
                </template>
              </div>
            </div>
          </template>
        </sale-cards>
      </div>
    </template>

    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4 offset-4" uno-lt="col-3">
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
            <common-cell label="订单备注" :value="props.orders.remark || '~'" />
          </div>
        </template>
      </sale-cards>
    </div>
    <sale-order-return-goods ref="returnGoodsRef" v-model:show="showModel" :where="props.orderWhere" :show-return-goods="showReturnGoods" :return-goods="props.returnGoods" />
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
