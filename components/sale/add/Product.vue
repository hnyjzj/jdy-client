<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  price: GoldPrices[]
  billingSet: BillingSet
  checkProductClass: (val: { class: number }) => any
}>()
const { $toast } = useNuxtApp()
// 展示商品列表
const orderObject = defineModel<Orders>({ default: {} as Orders })

// 设置折扣率
const handleDiscountRateBlur = (discount_rate?: number) => {
  if (!discount_rate) {
    orderObject.value.discount_rate = 100
    orderObject.value.showProductList?.forEach((item) => {
      item.discount_fixed = 100
    })
    return
  }
  orderObject.value.showProductList?.forEach((item) => {
    item.discount_fixed = discount_rate
  })
}

// 计算选择的成品列表中所有应付金额 不算折扣
const allAmount = () => {
  let total = 0
  orderObject.value.showProductList?.forEach((item: OrderProductFinished) => {
    total += item?.price_original || 0
  })
  return total
}

// 设置整体抹零金额
const handleAmountReduceBlur = (amount_reduce?: number) => {
  const productList = orderObject.value.showProductList || []
  if (!amount_reduce || amount_reduce < 0) {
    // 如果不符合条件，将amount_reduce的值设为undefined
    orderObject.value.round_off = 0
    // 遍历showProductList，将每个成品的抹零金额设为0
    productList?.forEach((item) => {
      item.round_off = 0
    })
    return
  }

  let accumulatedAmount = 0
  productList.forEach((item, index) => {
    // 如果是无效金额，直接设为0
    if (!item.price_original || allAmount() === 0 || amount_reduce === 0) {
      item.round_off = 0
      return
    }
    // 处理最后一项的特殊逻辑
    if (index === productList.length - 1) {
      item.round_off = calc('(a - b) | !n', {
        a: amount_reduce,
        b: accumulatedAmount,
      })
      return
    }
    // 计算常规项的抹零金额
    item.round_off = calc('((amount / allAmount) * amountReduce) | 1 ~5, !n , <=0', {
      amount: Number(item.price_original),
      allAmount: allAmount(),
      amountReduce: amount_reduce,
    })
    accumulatedAmount += item.round_off || 0
  })
}

// 更新总抵扣值
const updateDedution = () => {
  const total = ref(0)
  orderObject.value.showProductList?.forEach((item) => {
    total.value += item.integral_deduction || 0
  })

  if (total.value !== 0) {
    orderObject.value.integral_deduction = calc('(a * b) |!n', {
      a: total.value,
      b: Number(Props.billingSet.discount_rate),
    })
  }
  else {
    orderObject.value.integral_deduction = 0
  }
}
// 设置积分抵扣金额
const handleScoreReduceBlur = (scoreDeduct?: number) => {
  const productList = orderObject.value.showProductList || []
  // 如果积分抵扣金额小于0或者没有输入值，则清空积分抵扣金额，并重置所有商品积分抵扣为0
  if (!scoreDeduct || scoreDeduct < 0) {
    orderObject.value.integral_deduction = 0
    productList.forEach((item) => {
      item.integral_deduction = 0
    })
    return
  }
  let accumulatedDeduction = 0
  productList.forEach((item, index) => {
    if (!item.price_original || allAmount() === 0 || !scoreDeduct) {
      item.integral_deduction = 0
      return
    }
    if (index === productList.length - 1) {
      // 计算最后一项的积分抵扣
      item.integral_deduction = calc('(a - b) | !n', {
        a: scoreDeduct,
        b: accumulatedDeduction,
      })
      return
    }
    // 计算常规项的积分抵扣
    item.integral_deduction = calc('(amount / allAmount * scoreDeduct) | =0 ~5, !n', {
      amount: item.price_original,
      allAmount: allAmount(),
      scoreDeduct,
    })
    accumulatedDeduction += item.integral_deduction || 0
  })
}
// 添加商品
const addProduct = async (products: ProductFinisheds[]) => {
  orderObject.value.showProductList ??= []
  products.forEach(async (product: ProductFinisheds) => {
    if (product.retail_type === 1 && Number(product.label_price) <= 0) {
      $toast.error('计件商品标签价格不能小于等于0')
      return
    }
    const index = orderObject.value.showProductList?.findIndex(item => item.product_id === product?.id)
    //   添加成品到列表中
    if (index === -1) {
      const data = {
        name: product.name,
        retail_type: product.retail_type,
        label_price: product.label_price,
        weight_metal: product.weight_metal,
        code: product.code,
        product_id: product?.id as string, // 商品id
        discount_member: 100, // 会员折扣
        class: product.class,
      } as OrderProductFinished
      data.labor_fee = Number(product.labor_fee)
      // 匹配金价
      data.discount_fixed = Number(orderObject.value.discount_rate || 100)
      const exists = Props.price.filter(item =>
        item.product_type === GoodsType.ProductFinish
        && item.product_material === product.material
        && item.product_quality.includes(product.quality)
        && item.product_brand?.includes(product.brand),
      )
      data.price_gold = (exists && exists.length > 0) ? Number(exists[0].price) : undefined
      const rate = await Props.checkProductClass({ class: data.class })
      data.rate = (rate && rate !== '0') ? Number(rate) : 0
      orderObject.value.showProductList?.push(data)
      nextTick(() => {
        handleScoreReduceBlur(orderObject.value.integral_deduction || 0)
        handleAmountReduceBlur(orderObject.value.round_off || 0)
      })
    }
  })
}

const updateDelFn = (del_code: string) => {
  handleAmountReduceBlur(orderObject.value.round_off || 0)
  handleScoreReduceBlur(orderObject.value.integral_deduction || 0)
  handleDiscountRateBlur(orderObject.value.discount_rate || 0)
  if (del_code) {
    // 判断如果存在code ,就删除掉展示旧料列表中的对应的code
    orderObject.value.showMasterialsList?.forEach((item) => {
      if (item.exchange_finisheds?.includes(del_code)) {
        const index = item.exchange_finisheds?.indexOf(del_code)
        item.exchange_finisheds?.splice(index, 1)
      }
    })
  }
}
</script>

<template>
  <div>
    <common-card-info title="成品">
      <template #info>
        <sale-add-product-button
          @add-product="addProduct" />
        <!-- 整单折扣设置 -->
        <div class="px-[16px] py-[8px]">
          <!-- 成品列表 -->
          <sale-add-product-list
            v-model="orderObject"
            :billing-set="Props.billingSet"
            @update-score-deduction="updateDedution"
            @del-porduct="updateDelFn"
          />
        </div>
        <template v-if="orderObject.showProductList && orderObject.showProductList.length">
          <sale-add-product-deduction
            v-model="orderObject"
            @set-amount-reduce="handleAmountReduceBlur"
            @set-score-deduct="handleScoreReduceBlur"
            @set-discount-rate="handleDiscountRateBlur"
          />
        </template>
      </template>
    </common-card-info>
  </div>
</template>
