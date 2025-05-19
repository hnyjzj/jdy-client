<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  disScore: boolean
  filterList: Where<OrderWhere>
}>()
const formData = defineModel<Orders>('form', { default: {} })
// 成品列表数据
const showProductList = defineModel<ProductFinished[]>('showList', { default: [] })
// 旧料列表数据
const masterList = defineModel<ProductOld[]>('master', { default: [] })
// 配件列表数据
const PartsList = defineModel<ProductAccessories[]>('parts', { default: [] })
const deposit = defineModel<DepositOrderInfo[]>('deposit', { default: [] })
// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)
const addNewMethod = () => {
  formData.value.payments.push({ payment_method: 1, amount: 0 })
}

// 删除支付方式
const deleteMethod = (index: number) => {
  formData.value.payments.splice(index, 1)
}

// 计算成品列表金额
const depositMoney = computed(() => {
  const total = ref(0)
  total.value = deposit.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.price || 0 })
  }, 0)
  return total.value
})

// 计算成品列表金额
const productMoney = computed(() => {
  const total = ref(0)
  total.value = showProductList.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.price || 0 })
  }, 0)
  return total.value
})
// 旧料金额
const masterMoney = computed(() => {
  const total = ref(0)
  total.value = masterList.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.recycle_price || 0 })
  }, 0)
  return total.value
})
// 计算配件总金额
const PartsListMoney = computed(() => {
  const total = ref(0)
  total.value = PartsList.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.amount || 0 })
  }, 0)
  return total.value
})

// 计算成品列表加的积分
const productListScore = computed(() => {
  const total = ref(0)
  total.value = showProductList.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.integral || 0 })
  }, 0)
  return total.value
})
// 计算旧料列表 减的积分
const masterListScore = computed(() => {
  const total = ref(0)
  total.value = masterList.value.reduce((total, item) => {
    return calc('(t + i) | <=0,!n', { t: total, i: item.integral || 0 })
  }, 0)
  return total.value
})
// 配件积分
const PartsListScore = computed(() => {
  const total = ref(0)
  total.value = PartsList.value.reduce((total, item) => {
    return calc('(t + i ) | <=0,!n', { t: total, i: item.integral || 0 })
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

// 实际需要支付的金额
const payMoney = computed(() => {
  const total = ref(0) // 成品总金额
  total.value = calc('(a + b - c) - d | =0,!n', {
    a: productMoney.value,
    b: PartsListMoney.value,
    c: masterMoney.value,
    d: depositMoney.value,
  })
  return total.value
})
// 支付方式之和
const payMethodsTotal = computed(() => {
  const total = ref(0)
  formData.value.payments.forEach((item) => {
    total.value += item.amount
  })
  return total.value
})

// 未支付的金额
const unPayMoney = computed(() => {
  const total = ref(0)
  total.value = calc('(a - b)  | =2,!n', {
    a: payMoney.value,
    b: payMethodsTotal.value,
  })
  return total.value
})
</script>

<template>
  <common-fold title="结算信息" :is-collapse="false">
    <div class="p-[16px]">
      <div>
        <div>
          <n-grid :cols="24">
            <n-form-item-gi
              :span="16"
              label="积分抵扣" label-placement="left"
            >
              <n-input-number
                v-model:value="formData.integral_deduction"
                min="0"
                :disabled="props.disScore"
                placeholder="抵扣积分值"
                @focus="focus"
              />
            </n-form-item-gi>
          </n-grid>

          <div class="text-[12px] color-[#666]">
            1.注意这里只会扣减填写的积分，不会添加积分抵扣金额，请手动添加或使用整单优惠
          </div>
          <div class="text-[12px] color-[#666]">
            2.设置了开单积分抵扣比例的，这里不能填写积分，会根据积分抵扣金额自动算积分
          </div>
        </div>
        <div class="border-y-[#E6E6E8] border border-b-solid py-[12px] mb-[12px]">
          <common-cell label="货品金额" :value="productMoney" />
          <common-cell label="配件礼品" :value="PartsListMoney" />
          <common-cell label="旧料抵扣" :value="masterMoney" />
          <common-cell label="优惠金额" value="0" />
          <common-cell label="订金抵扣" value="0" />
          <common-cell label="积分合计：" :value="`销售(+${productListScore}) 旧料(-${masterListScore})  配件礼品(+${PartsListScore}) `" label-color="#3971F3" val-color="#3971F3" />
          <common-cell label="实际积分" :value="totalScore" label-color="#3971F3" val-color="#3971F3" />
          <common-cell label="实付金额" :value="payMoney" label-color="#3971F3" val-color="#3971F3" />
        </div>
        <div class=" ">
          <template v-for="(item, index) in formData.payments" :key="index">
            <div>
              <n-grid :cols="24" :x-gap="8">
                <n-form-item-gi
                  :span="12"
                  label="支付方式" label-placement="top"
                  :path="`payments[${index}].payment_method`"
                  :rule="{
                    type: 'number',
                    required: true,
                    message: `请选择支付方式`,
                    trigger: ['change', 'blur'],
                  }"
                >
                  <n-select
                    v-model:value="item.payment_method" :options="payMethods" />
                </n-form-item-gi>
                <n-form-item-gi
                  :span="12"
                  label="金额" label-placement="top"
                >
                  <div class="w-full">
                    <n-input-number
                      v-model:value="item.amount"
                      placeholder="支付金额"
                      round
                      min="0"
                      :show-button="false"
                      @focus="focus"
                    />
                  </div>
                  <div>
                    <template v-if="index === 0">
                      <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3] text-[26px]" @click="addNewMethod()">
                        +
                      </div>
                    </template>
                    <template v-if="index !== 0">
                      <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3]  text-[26px]" @click="deleteMethod(index)">
                        <div class="w-[10px] h-[2px] bg-[#3971F3]" />
                      </div>
                    </template>
                  </div>
                </n-form-item-gi>
              </n-grid>
            </div>
          </template>
        </div>
        <div class="border-y-[#E6E6E8] border border-y-solid py-[12px] mb-[12px]">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
            剩余未支付:{{ unPayMoney }}
          </div>
        </div>
        <n-form-item
          label="备注信息"
        >
          <n-input
            v-model:value="formData.remark"
            :style="{ '--n-border-radius': '20px' }"
            placeholder="备注信息"
            type="textarea"
            @focus="focus"
          />
        </n-form-item>
      </div>
    </div>
  </common-fold>
</template>

<style>
.n-input-number {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.refer {
  --uno: 'flex flex-between min-w-[80px] gap-[4px] px-[12px] py-[6px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}

.remark {
  --uno: 'w-auto border-[#E6E6E8] border border-solid rounded-[8px] px-[4px] pt-[4px] pb-[32px] bg-[#fff] tracking-[1px] text-[14px] dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.3)] color-[#333] dark:color-[#fff] resize-y';
}

textarea::placeholder {
  --uno: 'color-[#cbcdd1]';
}

.operation-enter-active,
.operation-leave-active {
  --uno: 'transition-all ease-in-out duration-500';
}
.operation-enter-from,
.operation-leave-to {
  --uno: 'translate-x-[30px] opacity-0';
}

textarea:focus {
  --uno: 'border border-solid border-[1px] border-[#3971f3] outline-[none]';
}
</style>
