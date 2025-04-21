<script lang="ts" setup>
import { calc } from 'a-calc'

const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
}>()
const emit = defineEmits<{
  updateScoreDeDeduction: []
}>()
const showProductList = defineModel<OrderProducts[]>('list', { default: [] })
const hasCheck = ref(false)
const dialog = useDialog()
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
      cardDeduction: methA(p.cardDeduction) || 0, // 卡券抵扣
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
      cardDeduction: methA(p.cardDeduction) || 0,
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
      cardDeduction: methA(p.cardDeduction) || 0,
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
</script>

<template>
  <div>
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
                  <!-- <n-form-item-gi :span="12" label="卡券抵扣">
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
                      </n-form-item-gi> -->
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
                        emit('updateScoreDeDeduction')
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

<style lang="scss" scoped>

</style>
