<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const props = defineProps<{
  filterList: Where<DepositOrderWhere>
  getSearchPhrase: (val: string) => Promise<Phrase[]>
}>()
const formData = defineModel<DepositOrder>({ default: {} })
const userremark = defineModel<string>('userremark', { default: {} })
const showProductList = defineModel<DepositOrderProduct[]>('list', { default: {} })

// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)
const addNewMethod = () => {
  formData.value.payments.push({ payment_method: 1, amount: undefined })
}
// 删除支付方式
const deleteMethod = (index: number) => {
  formData.value.payments.splice(index, 1)
}

// 定金金额
const depositAmount = computed(() => {
  const total = ref(0)
  showProductList.value.forEach((item) => {
    total.value += Number(item.price) || 0
  })
  return total.value
})
// 未支付的金额
const unPayMoney = computed(() => {
  const total = ref(0)
  formData.value.payments.forEach((item) => {
    total.value += item.amount || 0
  })
  return depositAmount.value - total.value
})

const remarkList = ref<SelectOption[]>([])
const searchRmk = async (query: string) => {
  const res = await props.getSearchPhrase(query)
  remarkList.value = res.map(item => ({
    label: item.content,
    value: item.content,
  }))
}
</script>

<template>
  <div>
    <common-card-info title="结算信息">
      <template #info>
        <div>
          <div class="border-b-[#E6E6E8] border border-b-solid pb-[16px]">
            订金金额:￥{{ depositAmount }}
          </div>
          <div class="pt-[16px]">
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
                      v-model:value="item.payment_method"
                      :options="payMethods" />
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
          <div class="border-b-[#E6E6E8] border border-b-solid py-[12px] mb-[12px]">
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
                  v-model:value="formData.remarks" filterable
                  multiple
                  :options="remarkList"
                  @search="searchRmk"
                  @focus="() => {
                    searchRmk('')
                  }"
                />
              </div>
              <n-input
                v-model:value="userremark"
                :style="{ '--n-border-radius': '20px' }"
                placeholder="备注信息"
                type="textarea"
                @focus="focus"
              />
            </div>
          </n-form-item>
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>

</style>
