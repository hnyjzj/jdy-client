<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  price: GoldPrices[]
  productList: ProductFinisheds[]
  finishedFilterList: Where<ProductFinisheds>
  isIntegral: boolean
  billingSet: BillingSet
  checkProductClass: (val: { class: number }) => any
}>()
const emits = defineEmits<{
  search: [val: string, type: string]
  openProductList: []
  updateScoreDeDeduction: [val?: number]
}>()

const { $toast } = useNuxtApp()
const dialog = useDialog()
// 展示商品列表
const showProductList = defineModel<OrderProducts[]>({ default: [] })
// 显示搜索弹窗
const showModal = ref(false)
// 搜索框
const searchProduct = ref('')
const hasCheck = ref(false)
// 搜索商品 名称 和 条码   code
const searchType = ref('name')

// 添加商品
const addProduct = async (product: ProductFinisheds) => {
  const index = showProductList.value.findIndex(item => item.product?.id === product.id)
  if (index !== -1 && showProductList.value[index].quantity) {
    // 判断是否已经添加过该商品,如果已经添加过,则数量加一
    // showProductList.value[index].quantity++
    $toast.error('该商品已经添加过')
    return
  }
  //   添加成品到列表中
  if (index === -1) {
    const data = {
      price: 0, // 金价
      quantity: 1, // 数量
      discount: undefined, // 折扣
      amount: 0, // 应付金额
      product_id: product.id, // 商品id
      labor_fee: 0, // 工费
      notCount: 0, // 抹零
      show_discount: 0, // 显示折扣
      orign: 0, // 原始价格
      member_discount: 100, // 会员折扣
      integral: 0, // 积分
      scoreDeduction: 0, // 积分抵扣
      cardDeduction: 0, // 卡券抵扣
      rate: 0, // 积分比例
      product,
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
      data.price = filtered[0].price
    }
    else {
      data.price = 0
    }
    const rate = await Props.checkProductClass({ class: data.product.class })
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

// 选择成品
const readyAddproduct = ref()
const setAddProduct = (product: ProductFinisheds) => {
  readyAddproduct.value = product
}
// 计件方式
const count = (p: OrderProducts) => {
  if (!p.quantity)
    return
  // 小数点进位计算函数
  const hold = holdFunction(Props.billingSet.decimal_point)
  // 取整控制函数
  const rounding = roundFunction(Props.billingSet.rounding)

  //   四舍五入 取证
  const methA = (count: string | number) => {
    return calc('( a ) |=0 ~5,!n', {
      a: count,
    }) || 0
  }
  // 如果是计件方式 标签价格 x 数量 x 折扣
  if (p.product?.retail_type === 1) {
    const total = calc(`(price * quantity * discount * member_discount) - notCount - scoreDeduction - cardDeduction | =${hold} ~${rounding},!n`, {
      price: p.product?.label_price, // 标签价格
      quantity: p.quantity, // 数量
      scoreDeduction: methA(p.scoreDeduction),
      cardDeduction: methA(p.cardDeduction), // 卡券抵扣
      member_discount: (p.member_discount || 100) * 0.01, // 会员折扣
      discount: ((p.discount || 100) * 0.01),
      notCount: p?.notCount, // 抹零
    })
    p.amount = total
    // 计算不算折扣的原价
    const orign = calc('(price * quantity) | <=2,!n', {
      price: p.product?.label_price,
      quantity: p.quantity,
    })
    p.orign = orign
    // 计算显示折扣
    p.show_discount = calc('(total / orign) * 100 | <=2,!n', {
      total,
      orign,
    })
    // 计算应得的积分 +
    if (Props.isIntegral) {
      p.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: p.amount,
        b: p.rate,
      })
    }
    else {
      p.integral = 0
    }

    return total
  }

  // 计重工费按克 [（金价 + 工费）X克重] X折扣
  if (p.product?.retail_type === 2) {
    const total = calc(`((price + labor_fee) * weight_metal * discount  * member_discount) - notCount - scoreDeduction - cardDeduction  | =${hold} ~${rounding},!n`, {
      price: p?.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product?.weight_metal,
      scoreDeduction: methA(p.scoreDeduction),
      cardDeduction: methA(p.cardDeduction),
      member_discount: (p.member_discount || 100) * 0.01,
      discount: ((p.discount || 100) * 0.01),
      notCount: p?.notCount,
    })
    p.amount = total
    const orign = calc('(price + labor_fee) * weight_metal | <=2,!n', {
      price: p?.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product.weight_metal,
    })
    p.orign = orign
    if (total === 0 && orign === 0) {
      p.show_discount = 0
    }
    else {
      p.show_discount = calc('(total / orign) * a | <=2 ,!n', {
        total: p?.amount,
        orign: p?.orign,
        a: 100,
      })
    }
    if (Props.isIntegral) {
      p.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: p.amount,
        b: p.rate,
      })
    }
    else {
      p.integral = 0
    }

    return total
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (p.product?.retail_type === 3) {
    const total = calc(`(((price * weight_metal) + labor_fee)  * discount  * member_discount ) - notCount  - scoreDeduction - cardDeduction |  =${hold} ~${rounding},!n`, {
      price: p.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product?.weight_metal,
      scoreDeduction: methA(p.scoreDeduction),
      cardDeduction: methA(p.cardDeduction),
      member_discount: (p.member_discount || 100) * 0.01,
      discount: ((p.discount || 100) * 0.01),
      notCount: p?.notCount,
    })
    p.amount = total
    const orign = calc('(((price * weight_metal) + labor_fee) ) | <=2,!n', {
      price: p.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product?.weight_metal,
    })
    p.orign = orign
    if (total === 0 && orign === 0) {
      p.show_discount = 0
    }
    else {
      p.show_discount = calc('(total / orign) * a | <=2 ,!n', {
        total: p?.amount,
        orign: p?.orign,
        a: 100,
      })
    }
    if (Props.isIntegral) {
      p.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: p.amount,
        b: p.rate,
      })
    }
    else {
      p.integral = 0
    }

    return total
  }
}

// 删除商品
const deleteProduct = (index: number) => {
  dialog.error({
    title: '确定删除此商品吗?',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: () => {
      showProductList.value.splice(index, 1)
    },
  })
}
// 搜索商品时候选择名称搜索还是条码搜索
const changeType = (type: 'name' | 'code') => {
  searchType.value = type
  searchProduct.value = ''
  emits('openProductList') // 搜索
}
const realtype = (val?: number) => {
  switch (val) {
    case 1:
      return '一口价'
    case 2:
      return '计重工费按克'
    case 3:
      return '计重工费按件'
  }
}

const { useWxWork } = useWxworkStore()
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    showModal.value = true
    changeType('code')
    searchProduct.value = code
  }
}

// 设置整单折扣率
const discount_rate = ref(undefined)
// 设置折扣率
const handleDiscountRateBlur = () => {
  if (!discount_rate.value || discount_rate.value <= 0) {
    showProductList.value.forEach((item) => {
      item.discount = 100
    })
    return
  }
  showProductList.value.forEach((item) => {
    item.discount = discount_rate.value
  })
}

// 计算选择的成品列表中所有应付金额 不算折扣
const allAmount = () => {
  let total = 0
  showProductList.value.forEach((item: OrderProducts) => {
    total += item?.orign || 0
  })
  return total
}
// 抹零金额
const amount_reduce = ref(undefined)
// 设置整体抹零金额
const handleAmountReduceBlur = () => {
  if (!showProductList.value.length) {
    $toast.warning('请先添加商品')
    amount_reduce.value = undefined
    return
  }
  // 初始化结果变量
  let result = 0
  // 检查amount_reduce的值是否小于0或者为空
  if ((amount_reduce?.value && amount_reduce?.value < 0) || !amount_reduce.value) {
    // 如果不符合条件，将amount_reduce的值设为undefined
    amount_reduce.value = undefined
    // 遍历showProductList，将每个item的notCount设为0
    showProductList.value.forEach((item) => {
      item.notCount = 0
    })
    // 退出函数
    return
  }
  showProductList.value.forEach((item, index) => {
    // 计算每个item的notCount
    item.notCount = calc('(amount / allAmount * amountReduce) | 1 ~5, !n , <=0', {
      amount: item.orign, // 应付金额
      allAmount: allAmount(), // 总金额
      amountReduce: amount_reduce.value || 0, // 整单设置抹零金额
    })
    // 如果不是最后一个item，累加notCount到结果变量
    if (index !== showProductList.value.length - 1) {
      result += item.notCount
    }
    else {
      // 用总抹零金额减去前面累加的抹零金额 就是最后一项的抹零金额
      item.notCount = calc('(a - b) | !n', {
        a: amount_reduce.value,
        b: result,
      })
    }
  })
}
// 设置整单积分抵扣
const scoreDeduct = ref(undefined)
const handleScoreReduceBlur = () => {
  let result = 0
  emits('updateScoreDeDeduction', scoreDeduct.value)
  // 如果积分抵扣金额小于0或者没有输入值，则清空积分抵扣金额，并重置所有商品积分抵扣为0
  if ((scoreDeduct?.value && scoreDeduct?.value < 0) || !scoreDeduct.value) {
    scoreDeduct.value = undefined
    showProductList.value.forEach((item) => {
      item.scoreDeduction = 0
    })
    return
  }

  // 遍历商品列表，计算每个商品的积分抵扣金额
  showProductList.value.forEach((item, index) => {
    // 计算当前商品的积分抵扣金额
    item.scoreDeduction = calc('(amount / allAmount * scoreDeduct) | =0 ~5, !n', {
      amount: item.orign, // 应付金额
      allAmount: allAmount(), // 总金额
      scoreDeduct: scoreDeduct.value || 0, // 整单设置积分抵扣金额
    })

    // 累加积分抵扣金额，但不包括最后一个商品
    if (index !== showProductList.value.length - 1) {
      result += item.scoreDeduction
    }
    else {
      // 最后一行 抹零金额
      item.scoreDeduction = calc('(a - b) | !n', {
        a: scoreDeduct.value,
        b: result,
      })
    }
  })
}

// 设置整单卡券抵扣
// 定义一个响应式变量couponDeduct，初始值为undefined，用于存储卡券抵扣金额
const couponDeduct = ref(undefined)
// 定义一个函数handleCouponReduceBlur，用于处理卡券抵扣金额失去焦点时的逻辑
const handleCouponReduceBlur = () => {
  // 初始化result变量，用于累加每项商品的卡券抵扣金额
  let result = 0
  // 检查couponDeduct的值是否小于0或者为空，如果是，则重置couponDeduct为undefined
  if ((couponDeduct?.value && couponDeduct?.value < 0) || !couponDeduct.value) {
    couponDeduct.value = undefined
    // 遍历showProductList中的每一项商品，将cardDeduction重置为0
    showProductList.value.forEach((item) => {
      item.cardDeduction = 0
    })
    return // 结束函数执行
  }

  showProductList.value.forEach((item, index) => {
    // 计算当前商品的卡券抵扣金额
    item.cardDeduction = calc('(amount / allAmount * couponDeduct) | =0 ~5, !n', {
      amount: item.orign, // 应付金额
      allAmount: allAmount(), // 总金额
      couponDeduct: couponDeduct.value || 0, // 整单设置卡券抵扣
    })

    if (index !== showProductList.value.length - 1) {
      result += item.cardDeduction
    }
    else {
      // 最后一行 抹零金额
      item.cardDeduction = calc('(a - b) | !n', {
        a: couponDeduct.value,
        b: result,
      })
    }
  })
}
</script>

<template>
  <common-fold title="成品信息" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12 gap-[20px]">
        <div
          class="btn-left col-span-4 offset-2 cursor-pointer" @click="() => {
            emits('openProductList')
            showModal = true
            searchProduct = ''
            readyAddproduct = null
          }">
          <icon name="i-icon:search" color="#fff" :size="12" />
          <div class="ml-2">
            搜索
          </div>
        </div>
        <div
          class="btn-right col-span-4 cursor-pointer" @click="scanCode()"
        >
          <icon name="i-icon:scanit" color="#1a6beb" :size="12" />
          <div class="ml-2">
            扫码
          </div>
        </div>
      </div>
    </div>

    <template v-if="true">
      <div class="px-[16px]">
        <div class="flex justify-between">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi
              :span="12"
              label="整单折扣" label-placement="top"
            >
              <n-input-number
                v-model:value="discount_rate"
                placeholder="请输入折扣"
                round
                :precision="2"
                min="1"
                max="100"
                :show-button="false"
                @update:value="handleDiscountRateBlur"
              >
                <template #suffix>
                  %
                </template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="卡券抵扣" label-placement="top"
            >
              <n-input-number
                v-model:value="couponDeduct"
                placeholder="0"
                round
                min="0"
                :precision="2"
                :show-button="false"
                @blur="handleCouponReduceBlur"

              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="积分抵扣" label-placement="top"
            >
              <n-input-number
                v-model:value="scoreDeduct"
                placeholder="0"
                round
                min="0"
                :precision="2"
                :show-button="false"
                @blur="handleScoreReduceBlur"

              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="抹零金额" label-placement="top"
            >
              <n-input-number
                v-model:value="amount_reduce"
                placeholder="0"
                round
                min="0"
                :precision="2"
                :show-button="false"
                @blur="handleAmountReduceBlur"

              />
            </n-form-item-gi>
          </n-grid>
        </div>
      </div>
      <div class="px-[16px] py-[8px]">
        <template v-for="(obj, ix) in showProductList" :key="ix">
          <div class="pb-[12px]">
            <sale-order-nesting v-model="hasCheck" :title="obj.product?.name || ''">
              <template #left>
                <common-tags type="pink" text="成品" :is-oval="true" />
              </template>
              <template #info>
                <div class="flex flex-col gap-[4px] px-[16px]">
                  <common-cell label="名称" :value="obj.product?.name" />
                  <common-cell label="条码" :value="obj.product?.code" />
                  <common-cell label="金重" :value="obj.product?.weight_metal" />
                  <common-cell label="零售方式" :value="realtype(obj.product?.retail_type)" />
                  <common-cell label="标签价" :value="obj.product?.label_price" val-color="#2472EE" />
                  <common-cell label="折扣" :value="`${obj.show_discount}%`" val-color="#2472EE" />
                  <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                  <div class="pb-[16px]">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="12" label="固定折扣">
                        <n-input-number
                          v-model:value="obj.discount"
                          :show-button="false"
                          placeholder="请输入折扣"
                          round
                          min="0"
                          max="100"
                          :default-value="100"

                          @blur="() => {
                            if (!obj.discount?.toString()){
                              obj.discount = 100
                            }
                          }"
                        >
                          <template #suffix>
                            %
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="抹零">
                        <n-input-number
                          v-model:value="obj.notCount"
                          :show-button="false"
                          placeholder="抹零金额"
                          :default-value="0"
                          min="0"
                          round

                          @blur="() => {
                            if (!obj.notCount?.toString()){
                              obj.notCount = 0
                            }
                          }"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="卡券抵扣">
                        <n-input-number
                          v-model:value="obj.cardDeduction"
                          :show-button="false"
                          placeholder="卡券抵扣"
                          :default-value="0"
                          min="0"
                          round
                          :precision="2"
                          @blur="() => {
                            if (!obj.cardDeduction?.toString()){
                              obj.cardDeduction = 0
                            }
                          }"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="积分抵扣">
                        <n-input-number
                          v-model:value="obj.scoreDeduction"
                          :show-button="false"
                          placeholder="积分抵扣"
                          :default-value="0"
                          min="0"
                          round
                          :precision="2"
                          @blur="() => {
                            if (!obj.scoreDeduction?.toString()){
                              obj.scoreDeduction = 0
                            }
                            emits('updateScoreDeDeduction')
                          }"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="会员折扣">
                        <n-input-number
                          v-model:value="obj.member_discount"
                          :show-button="false"
                          placeholder="会员折扣"
                          :default-value="0"
                          min="0"
                          :max="100"
                          round

                          @blur="() => {
                            if (!obj.member_discount?.toString()){
                              obj.member_discount = 100
                            }
                          }"
                        >
                          <template #suffix>
                            %
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="积分(+)">
                        <n-input-number
                          v-model:value="obj.integral"
                          :show-button="false"
                          placeholder="积分"
                          :default-value="0"
                          min="0"
                          round
                          :precision="2"
                          :disabled="true"
                          @blur="() => {
                            if (!obj.integral?.toString()){
                              obj.integral = 0
                            }
                          }"
                        />
                      </n-form-item-gi>
                      <template v-if="obj.product?.retail_type !== 1">
                        <n-form-item-gi :span="12" label="金价(元/g)">
                          <n-input-number
                            v-model:value="obj.price"
                            :show-button="false"
                            placeholder="请输入金价(元/g)"
                            round

                            @blur="() => {
                              if (!obj.price?.toString()){
                                obj.price = 0
                              }
                            }"
                          />
                        </n-form-item-gi>
                      </template>

                      <template v-if="obj.product?.retail_type !== 1">
                        <n-form-item-gi :span="12" label="工费">
                          <n-input-number
                            v-model:value="obj.labor_fee"
                            :show-button="false"
                            placeholder="请输入工费"
                            round
                            min="0"

                            @blur="() => {
                              if (!obj.labor_fee?.toString()){
                                obj.labor_fee = 0
                              }
                            }"
                          />
                        </n-form-item-gi>
                      </template>
                    </n-grid>
                    <div class="flex justify-between items-center">
                      <div>
                        <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteProduct(ix)">
                          <icon name="i-svg:delete" :size="16" />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="item-left">
                          应付金额：
                        </div>
                        <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                          ￥{{ count(obj) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </sale-order-nesting>
          </div>
        </template>
      </div>
    </template>

    <common-model v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="showModal = false">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex justify-around py-[12px]">
              <div
                class="flex-center-col"
                @click="changeType('name')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'name' ? '#333' : '#53565C' }">
                  名称搜索
                </div>
                <div class="w-[32px] h-[4px] rounded " :style="{ background: searchType === 'name' ? '#2080F0' : '' }" />
              </div>
              <div
                class="flex-center-col"
                @click="changeType('code')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'code' ? '#333' : '#53565C' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: searchType === 'code' ? '#2080F0' : '' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                v-model:value="searchProduct"
                type="text"
                clearable
                :placeholder="searchType === 'name' ? '请输入商品名称' : '请输入商品条码'" />
            </div>
            <div class="pl-[16px]">
              <n-button type="info" round @click="emits('search', searchProduct, searchType)">
                搜索
              </n-button>
            </div>
          </div>
          <div class="grid-12 px-[12px] color-[#333] font-semibold !text-[16px]">
            <div class="col-4">
              条码
            </div>
            <div class="col-4">
              名称
            </div>
            <div class="col-3">
              销售方式
            </div>
            <div class="col-1">
              金重
            </div>
          </div>
          <div class="h-[300px] overflow-y-auto py-[16px]">
            <template v-for="(item, index) in Props.productList" :key="index">
              <div
                class="py-[12px] px-[8px] rounded-2xl grid-12 "
                :style="{ color: readyAddproduct && item.id === readyAddproduct.id ? '#2080F0' : '',
                          background: readyAddproduct && item.id === readyAddproduct.id ? '#fff' : '' }"
                @click="setAddProduct(item)">
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.code }}
                </div>
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.name }}
                </div>
                <div class="col-3">
                  {{ realtype(item.retail_type) }}
                </div>
                <div class="col-1">
                  {{ item.weight_metal }}
                </div>
              </div>
            </template>
            <template v-if="Props.productList.length === 0">
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}

.activeBtn {
  --uno: 'bg-[#2080F0] color-[#fff]';
}
.defaultBtn {
  --uno: 'bg-[#F3F3F3] color-[#000]';
}
.n-input-number {
  width: 100%;
}
</style>
