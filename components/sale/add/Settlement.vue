<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'
import { calc } from 'a-calc'

const props = defineProps<{
  disScore: boolean
  filterList: Where<OrderWhere>
  storeid: string
  billingSet: BillingSet
}>()
const { getPhraseList } = usePhrase()
// 获取备注列表
const getSearchPhrase = async (value: string) => {
  const res = await getPhraseList({ page: 1, limit: 10, where: { store_id: props.storeid, content: value || '' } })
  return res || [] as Phrase[]
}
const orderObject = defineModel<Orders>('form', { default: {} })

const deposit = defineModel<DepositOrderInfo[]>('deposit', { default: [] })

// const payments = ref<Orders['payments']>([{ amount: undefined, payment_method: 1 }])
// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)

const addNewMethod = () => {
  orderObject.value.payments ??= []
  orderObject.value.payments.push({ payment_method: 1, amount: undefined })
}

// 删除支付方式
const deleteMethod = (index: number) => {
  orderObject.value.payments.splice(index, 1)
}
const hold = holdFunction(props.billingSet.decimal_point)
// 取整控制函数
const rounding = roundFunction(props.billingSet.rounding)
// 计算成品列表金额
const depositMoney = computed(() => {
  const total = ref(0)
  total.value = deposit.value.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.price || 0 })
  }, 0)
  return total.value
})
//
// 计算成品列表金额
const productMoney = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showProductList)
    return total.value
  total.value = orderObject.value.showProductList?.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.price || 0 })
  }, 0)
  return total.value
})
// 旧料金额
const masterMoney = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showMasterialsList)
    return total.value
  total.value = orderObject.value.showMasterialsList.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.recycle_price || 0 })
  }, 0)
  return total.value
})
// 计算配件总金额
const PartsListMoney = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showPartsList)
    return total.value
  total.value = orderObject.value.showPartsList.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.amount || 0 })
  }, 0)
  return total.value
})

// 计算成品列表加的积分
const productListScore = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showProductList)
    return total.value
  total.value = orderObject.value.showProductList.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.integral || 0 })
  }, 0)
  return total.value
})
// 计算旧料列表 减的积分
const masterListScore = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showMasterialsList)
    return total.value
  total.value = orderObject.value.showMasterialsList.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.integral || 0 })
  }, 0)
  return total.value
})
// 配件积分
const PartsListScore = computed(() => {
  const total = ref(0)
  if (!orderObject.value.showPartsList)
    return total.value
  total.value = orderObject.value.showPartsList.reduce((total, item) => {
    return calc(`(t + i) | =${hold} ~${rounding},!n`, { t: total, i: item.integral || 0 })
  }, 0)
  return total.value
})
// 总积分计算
const totalScore = computed(() => {
  return calc(`(a - b + c) | =${hold} ~${rounding},!n`, {
    a: productListScore.value || 0,
    b: masterListScore.value || 0,
    c: PartsListScore.value || 0,
  })
})

// 实际需要支付的金额
const payMoney = computed(() => {
  const total = ref(0) // 成品总金额
  total.value = calc(`(a + b - c) - d | =${hold} ~${rounding},!n`, {
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
  orderObject.value.payments?.forEach((item) => {
    total.value += item.amount || 0
  })
  return total.value
})

// 未支付的金额
const unPayMoney = computed(() => {
  const total = ref(0)
  total.value = calc(`(a - b)  |  =${hold} ~${rounding},!n`, {
    a: payMoney.value,
    b: payMethodsTotal.value,
  })
  return total.value
})
const remarkList = ref<SelectOption[]>([])
const searchRmk = async (query: string) => {
  const res = await getSearchPhrase(query)
  remarkList.value = res.map(item => ({
    label: item.content,
    value: item.content,
  }))
}
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
                v-model:value="orderObject.integral_deduction"
                min="0"
                :disabled="props.disScore"
                placeholder="抵扣积分值"
                @focus="focus"
              />
            </n-form-item-gi>
          </n-grid>

          <div class="text-[12px] color-[#666] dark:color-[#fff]">
            1.注意这里只会扣减填写的积分，不会添加积分抵扣金额，请手动添加或使用整单优惠
          </div>
          <div class="text-[12px] color-[#666] dark:color-[#fff]">
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
          <template v-for="(item, index) in orderObject.payments" :key="index">
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
                    v-model:value="item.payment_method"
                    :options="payMethods"
                  />
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
        <div class="border-t-[#E6E6E8] border border-t-solid py-[12px] mb-[12px]">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
            剩余未支付:{{ unPayMoney }}
          </div>
        </div>
        <n-form-item
          label="备注信息"
        >
          <div class="flex flex-col w-full">
            <div class="pb-[12px]">
              <n-select
                v-model:value="orderObject.remarks" filterable
                multiple
                :options="remarkList"
                @search="searchRmk"
                @focus="() => {
                  searchRmk('')
                }"
              />
            </div>
            <n-input
              v-model:value="orderObject.userRemark"
              :style="{ '--n-border-radius': '20px' }"
              placeholder="备注信息"
              type="textarea"
              @focus="focus"
            />
          </div>
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
