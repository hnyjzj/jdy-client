<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  title: string
  price: GoldPrices[]
  isIntegral: boolean
  billingSet: BillingSet
  searchProductList: (data: { val: string, type: string }) => Promise<ProductFinisheds[]>
  checkProductClass: (val: { class: number }) => any
}>()
const { $toast } = useNuxtApp()
// 展示商品列表
const showProductList = defineModel<ProductFinished[]>({ default: [] })
const formData = defineModel('formData', { default: {} as Orders })
// 显示搜索弹窗
const showModal = ref(false)

// 添加商品
const addProduct = async (product: ProductFinisheds) => {
  const index = showProductList.value.findIndex(item => item.product_id === product?.id)

  //   添加成品到列表中
  if (index === -1) {
    const data = {
      name: product.name,
      retail_type: product.retail_type,
      label_price: product.label_price,
      weight_metal: product.weight_metal,
      code: product.code,
      price_gold: 0, // 金价
      discount_fixed: 100, // 折扣
      price: 0, // 应付金额
      product_id: product?.id as string, // 商品id
      labor_fee: 0, // 工费
      round_off: 0, // 抹零
      discount_final: 0, // 显示折扣
      price_original: 0, // 原始价格
      discount_member: 100, // 会员折扣
      integral: 0, // 积分
      integral_deduction: 0, // 积分抵扣
      rate: 0, // 积分比例
      class: product.class,
    //   product,
    }
    data.labor_fee = Number(product.labor_fee)
    // 匹配金价
    const filtered = Props.price.filter(item => item.product_type === product.retail_type)
    const exists = filtered.some(item =>
      item.product_type === product.retail_type
      && item.product_material === product.material
      && item.product_quality.includes(product.quality)
      && item.product_brand?.includes(product.brand),
    )

    if (exists) {
      data.price_gold = Number(filtered[0].price)
    }
    else {
      data.price_gold = 0
    }
    const rate = await Props.checkProductClass({ class: data.class })
    if (rate && rate !== '0') {
      data.rate = Number(rate)
    }

    showProductList.value.push(data)
    showModal.value = false
  }
  else {
    $toast.error('该商品已经添加过')
  }
}

// 设置折扣率
const handleDiscountRateBlur = (discount_rate: number) => {
  if (!discount_rate || discount_rate <= 0) {
    showProductList.value.forEach((item) => {
      item.discount_fixed = 100
    })
    return
  }
  showProductList.value.forEach((item) => {
    item.discount_fixed = discount_rate
  })
}

// 计算选择的成品列表中所有应付金额 不算折扣
const allAmount = () => {
  let total = 0
  showProductList.value.forEach((item: ProductFinished) => {
    total += item?.price_original || 0
  })
  return total
}

// 设置整体抹零金额
const handleAmountReduceBlur = (amount_reduce: number) => {
  if (showProductList.value.length === 0) {
    $toast.warning('请先添加商品')
    return
  }
  // 初始化结果变量
  let result = 0
  // 检查amount_reduce的值是否小于0或者为空
  if ((amount_reduce && amount_reduce < 0) || !amount_reduce) {
    // 如果不符合条件，将amount_reduce的值设为undefined
    amount_reduce = 0
    // 遍历showProductList，将每个item的notCount设为0
    showProductList.value.forEach((item) => {
      item.round_off = 0
    })
    // 退出函数
    return
  }
  formData.value.round_off = amount_reduce
  showProductList.value.forEach((item, index) => {
    // 计算每个item的 抹零金额
    item.round_off = calc('(amount / allAmount * amountReduce) | 1 ~5, !n , <=0', {
      amount: item.price_original,
      allAmount: allAmount(),
      amountReduce: amount_reduce || 0, // 整单设置抹零金额
    })
    // 如果不是最后一个item，累加notCount到结果变量
    if (index !== showProductList.value.length - 1) {
      result += item?.round_off || 0
    }
    else {
      // 用总抹零金额减去前面累加的抹零金额 就是最后一项的抹零金额
      item.round_off = calc('(a - b) | !n', {
        a: amount_reduce,
        b: result,
      })
    }
  })
}

// 更新抵扣值
const updateDedution = (val?: number) => {
  if (val) {
    // 如果存在
    formData.value.integral_deduction = calc('(a * b) |!n', {
      a: val,
      b: Props.billingSet.discount_rate,
    })
  }
  else {
    const total = ref(0)
    showProductList.value.forEach((item) => {
      total.value += item.integral_deduction || 0
    })

    if (total.value !== 0) {
      formData.value.integral_deduction = calc('(a * b) |!n', {
        a: total.value,
        b: Number(Props.billingSet.discount_rate),
      })
    }
    else {
      formData.value.integral_deduction = 0
    }
  }
}
// 设置积分抵扣金额
const handleScoreReduceBlur = (scoreDeduct: number) => {
  let result = 0
  updateDedution(scoreDeduct)
  // 如果积分抵扣金额小于0或者没有输入值，则清空积分抵扣金额，并重置所有商品积分抵扣为0
  if ((scoreDeduct && scoreDeduct < 0) || !scoreDeduct) {
    scoreDeduct = 0
    showProductList.value.forEach((item) => {
      item.integral_deduction = 0
    })
    return
  }

  // 遍历商品列表，计算每个商品的积分抵扣金额
  showProductList.value.forEach((item, index) => {
    // 计算当前商品的积分抵扣金额
    item.integral_deduction = calc('(amount / allAmount * scoreDeduct) | =0 ~5, !n', {
      amount: item.price_original, // 应付金额
      allAmount: allAmount(), // 总金额
      scoreDeduct: scoreDeduct || 0, // 整单设置积分抵扣金额
    })

    // 累加积分抵扣金额，但不包括最后一个商品
    if (index !== showProductList.value.length - 1) {
      result += item?.integral_deduction || 0
    }
    else {
      // 最后一行 抹零金额
      item.integral_deduction = calc('(a - b) | !n', {
        a: scoreDeduct,
        b: result,
      })
    }
  })
}

// 设置整单卡券抵扣
// 定义一个响应式变量couponDeduct，初始值为undefined，用于存储卡券抵扣金额
// const couponDeduct = ref(undefined)
// 定义一个函数handleCouponReduceBlur，用于处理卡券抵扣金额失去焦点时的逻辑
// const handleCouponReduceBlur = () => {
//   // 初始化result变量，用于累加每项商品的卡券抵扣金额
//   let result = 0
//   // 检查couponDeduct的值是否小于0或者为空，如果是，则重置couponDeduct为undefined
//   if ((couponDeduct?.value && couponDeduct?.value < 0) || !couponDeduct.value) {
//     couponDeduct.value = undefined
//     // 遍历showProductList中的每一项商品，将cardDeduction重置为0
//     showProductList.value.forEach((item) => {
//       item.cardDeduction = 0
//     })
//     return // 结束函数执行
//   }

//   showProductList.value.forEach((item, index) => {
//     // 计算当前商品的卡券抵扣金额
//     item.cardDeduction = calc('(amount / allAmount * couponDeduct) | =0 ~5, !n', {
//       amount: item.orign, // 应付金额
//       allAmount: allAmount(), // 总金额
//       couponDeduct: couponDeduct.value || 0, // 整单设置卡券抵扣
//     })

//     if (index !== showProductList.value.length - 1) {
//       result += item.cardDeduction
//     }
//     else {
//       // 最后一行 抹零金额
//       item.cardDeduction = calc('(a - b) | !n', {
//         a: couponDeduct.value,
//         b: result,
//       })
//     }
//   })
// }
// 点击搜索按钮 弹出弹窗
const clickSearchButton = () => {
  showModal.value = true
}
</script>

<template>
  <common-fold :title="Props.title" :is-collapse="false">
    <sale-add-product-button @search="clickSearchButton" />
    <!-- 整单折扣设置 -->
    <sale-add-product-deduction
      @set-amount-reduce="handleAmountReduceBlur"
      @set-score-deduct="handleScoreReduceBlur"
      @set-discount-rate="handleDiscountRateBlur"
    />
    <div class="px-[16px] py-[8px]">
      <!-- 成品列表 -->
      <sale-add-product-list
        v-model:list="showProductList"
        :billing-set="Props.billingSet"
        :is-integral="Props.isIntegral"
        @update-score-de-deduction="updateDedution" />
    </div>
    <!-- 选择时使用的列表 -->
    <sale-add-product-popup
      v-model:show="showModal"
      :search-product-list="searchProductList"
      @add-product="addProduct" />
  </common-fold>
</template>
