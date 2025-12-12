<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  filterList: Where<DepositOrderWhere>
}>()
const formData = defineModel<otherOrderCreate>('form', { default: {} })

// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)
const addNewMethod = () => {
  formData.value.payments.push({ payment_method: 1, amount: undefined })
}
// 删除支付方式
const deleteMethod = (index: number) => {
  formData.value.payments.splice(index, 1)
}

const totalMoney = () => {
  const total = ref(0)
  total.value = formData.value.payments.reduce((total, item) => {
    return calc('(t + i) | <=2,!n', { t: total, i: item.amount || 0 })
  }, 0)
  formData.value.amount = total.value
  return total.value
}
</script>

<template>
  <div>
    <common-card-info title="结算信息">
      <template #info>
        <div class="pt-[16px]">
          <template v-for="(item, index) in formData.payments" :key="index">
            <div>
              <common-layout-form>
                <n-form-item
                  class="col-6"
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
                    :options="payMethods" />
                </n-form-item>
                <n-form-item
                  class="col-6"
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
                </n-form-item>
              </common-layout-form>
            </div>
          </template>
        </div>
        <div class=" py-[12px] mb-[12px]">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
            订单金额:{{ totalMoney() }}
          </div>
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>

</style>
