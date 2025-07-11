<script lang="ts" setup>
import { calc } from 'a-calc'

const Props = defineProps<{
  billingSet: BillingSet
  isIntegral: boolean
}>()
const emit = defineEmits<{
  updateScoreDeDeduction: []

}>()
const showProductList = defineModel<ProductFinished[]>('list', { default: [] })
const hasCheck = ref(false)
const realtype = (val?: number) => {
  switch (val) {
    case 1:
      return '计件'
    case 2:
      return '计重工费按克'
    case 3:
      return '计重工费按件'
  }
}
const deleteDialog = ref(false)
const dleId = ref(0)

const delProduct = () => {
  showProductList.value.splice(dleId.value, 1)
  dleId.value = 0
}
// 删除商品
const deleteProduct = (index: number) => {
  dleId.value = index
  deleteDialog.value = true
}
// 计件方式
const count = (p: ProductFinished) => {
  // 小数点进位计算函数
  const hold = holdFunction(Props.billingSet.decimal_point)
  // 取整控制函数
  const rounding = roundFunction(Props.billingSet.rounding)

  //   四舍五入 取证
  const methA = (count?: string | number) => {
    return count
      ? calc('( a ) |=0 ~5,!n', {
        a: count,
      }) || 0
      : 0
  }
  // 如果是计件方式 标签价格 x 数量 x 折扣
  if (p?.retail_type === 1) {
    const total = calc(`(price * quantity * discount * member_discount) - notCount - scoreDeduction - cardDeduction | =${hold} ~${rounding},!n`, {
      price: p?.label_price || 0, // 标签价格
      quantity: 1, // 数量
      scoreDeduction: methA(p.integral_deduction || 0) || 0,
      cardDeduction: 0, // 卡券抵扣
      member_discount: (p.discount_member || 100) * 0.01, // 会员折扣
      discount: ((p.discount_fixed || 100) * 0.01),
      notCount: p?.round_off || 0, // 抹零
    })
    p.price = total
    // 计算不算折扣的原价
    const orign = calc(`(price * quantity) | =${hold} ~${rounding},!n`, {
      price: p?.label_price || 0,
      quantity: 1,
    })
    p.price_original = orign
    // 计算显示折扣
    p.discount_final = calc('(total / orign) * 100 | <=2,!n', {
      total,
      orign,
    })
    // 计算应得的积分 +
    if (Props.isIntegral) {
      if (p.rate === 0) {
        p.integral = 0
      }
      else {
        p.integral = calc('(a / b) | =0 ~5 ,!n', {
          a: p.price,
          b: p.rate,
        })
      }
    }
    else {
      p.integral = 0
    }

    return total
  }

  // 计重工费按克 [（金价 + 工费）X克重] X折扣
  if (p.retail_type === 2) {
    const total = calc(`((price + labor_fee) * weight_metal * discount  * member_discount) - notCount - scoreDeduction - cardDeduction  | =${hold} ~${rounding},!n`, {
      price: p?.price_gold || 0,
      labor_fee: p?.labor_fee || 0,
      weight_metal: p?.weight_metal || 0,
      scoreDeduction: methA(p.integral_deduction) || 0,
      cardDeduction: 0,
      member_discount: (p.discount_member || 100) * 0.01,
      discount: ((p.discount_fixed || 100) * 0.01),
      notCount: p?.round_off || 0,
    })
    p.price = total
    const orign = calc(`(price + labor_fee) * weight_metal | =${hold} ~${rounding},!n`, {
      price: p?.price_gold || 0,
      labor_fee: p?.labor_fee || 0,
      weight_metal: p.weight_metal || 0,
    })
    p.price_original = orign
    if (total === 0 && orign === 0) {
      p.discount_final = 0
    }
    else {
      p.discount_final = calc('(total / orign) * a | <=2 ,!n', {
        total: p?.price || 0,
        orign: p?.price_original || 0,
        a: 100,
      })
    }

    if (Props.isIntegral) {
      if (p.rate === 0) {
        p.integral = 0
      }
      else {
        p.integral = calc('(a / b) | =0 ~5 ,!n', {
          a: p.price,
          b: p.rate,
        })
      }
    }
    else {
      p.integral = 0
    }

    return total
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (p.retail_type === 3) {
    const total = calc(`(((price * weight_metal) + labor_fee)  * discount  * member_discount ) - notCount  - scoreDeduction - cardDeduction |  =${hold} ~${rounding},!n`, {
      price: p.price_gold || 0,
      labor_fee: p?.labor_fee || 0,
      weight_metal: p?.weight_metal || 0,
      scoreDeduction: methA(p.integral_deduction) || 0,
      cardDeduction: 0,
      member_discount: (p.discount_member || 100) * 0.01,
      discount: ((p.discount_fixed || 100) * 0.01),
      notCount: p?.round_off || 0,
    })
    p.price = total
    const orign = calc(`(((price * weight_metal) + labor_fee) ) | =${hold} ~${rounding},!n`, {
      price: p.price_gold || 0,
      labor_fee: p?.labor_fee || 0,
      weight_metal: p?.weight_metal || 0,
    })
    p.price_original = orign
    if (total === 0 && orign === 0) {
      p.discount_final = 0
    }
    else {
      p.discount_final = calc('(total / orign) * a | <=2 ,!n', {
        total: p?.price,
        orign: p?.price_original,
        a: 100,
      })
    }
    if (Props.isIntegral) {
      if (p.rate === 0) {
        p.integral = 0
      }
      else {
        p.integral = calc('(a / b) | =0 ~5 ,!n', {
          a: p.price,
          b: p.rate,
        })
      }
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
        <sale-order-nesting v-model="hasCheck" :title="obj?.name || ''">
          <template #left>
            <common-tags type="pink" text="成品" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[4px] px-[16px]">
              <common-cell label="名称" :value="obj?.name" />
              <common-cell label="条码" :value="obj?.code" />
              <common-cell label="金重" :value="obj?.weight_metal" />
              <common-cell label="零售方式" :value="realtype(obj?.retail_type)" />
              <common-cell label="标签价" :value="obj?.label_price" val-color="#2472EE" />
              <common-cell label="折扣" :value="`${obj.discount_final}%`" val-color="#2472EE" />
              <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
              <div class="pb-[16px]">
                <n-grid :cols="24" :x-gap="8">
                  <n-form-item-gi :span="12" label="固定折扣">
                    <n-input-number
                      v-model:value="obj.discount_fixed"
                      :show-button="false"
                      placeholder="请输入折扣"
                      round
                      min="0"
                      max="100"
                      :default-value="100"
                      @focus="focus"

                      @blur="() => {
                        if (!obj.discount_fixed?.toString()){
                          obj.discount_fixed = 100
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
                      v-model:value="obj.round_off"
                      :show-button="false"
                      placeholder="抹零金额"
                      :default-value="0"
                      min="0"
                      round
                      @focus="focus"

                      @blur="() => {
                        if (!obj.round_off?.toString()){
                          obj.round_off = 0
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
                      v-model:value="obj.integral_deduction"
                      :show-button="false"
                      placeholder="积分抵扣"
                      :default-value="0"
                      min="0"
                      round
                      :precision="2"
                      @focus="focus"
                      @blur="() => {
                        if (!obj.integral_deduction?.toString()){
                          obj.integral_deduction = 0
                        }
                        emit('updateScoreDeDeduction')
                      }"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="会员折扣">
                    <n-input-number
                      v-model:value="obj.discount_member"
                      :show-button="false"
                      placeholder="会员折扣"
                      :default-value="0"
                      min="0"
                      :max="100"
                      round
                      @focus="focus"

                      @blur="() => {
                        if (!obj.discount_member?.toString()){
                          obj.discount_member = 100
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
                      @focus="focus"
                      @blur="() => {
                        if (!obj.integral?.toString()){
                          obj.integral = 0
                        }
                      }"
                    />
                  </n-form-item-gi>
                  <template v-if="obj?.retail_type !== 1">
                    <n-form-item-gi :span="12" label="金价(元/g)">
                      <n-input-number
                        v-model:value="obj.price_gold"
                        :show-button="false"
                        placeholder="请输入金价(元/g)"
                        round
                        min="0"
                        @focus="focus"

                        @blur="() => {
                          if (!obj.price_gold?.toString()){
                            obj.price_gold = 0
                          }
                        }"
                      />
                    </n-form-item-gi>
                  </template>

                  <template v-if="obj?.retail_type !== 1">
                    <n-form-item-gi :span="12" label="工费">
                      <n-input-number
                        v-model:value="obj.labor_fee"
                        :show-button="false"
                        placeholder="请输入工费"
                        round
                        min="0"
                        @focus="focus"
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
    <common-confirm v-model:show="deleteDialog" icon="error" title="删除产品" text="确认要删除此成品吗?" @submit="delProduct" />
  </div>
</template>

<style lang="scss" scoped>

</style>
