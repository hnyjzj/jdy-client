<script lang="ts" setup>
const props = defineProps<{
  filterList: Where<service>
}>()
const formData = defineModel<serviceOrederCreate>({ default: {} })

// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)
const addNewMethod = () => {
  formData.value.payments?.push({ payment_method: 1, amount: undefined })
}
// 删除支付方式
const deleteMethod = (index: number) => {
  formData.value.payments?.splice(index, 1)
}

// 未支付的金额
const unPayMoney = computed(() => {
  const total = ref(0)
  formData.value.payments?.forEach((item) => {
    total.value += item.amount || 0
  })
  if (formData.value.expense) {
    return formData.value?.expense - total.value
  }
  else {
    return 0
  }
})
</script>

<template>
  <div>
    <common-card-info title="结算信息">
      <template #info>
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
                  v-model:value="item.payment_method" :options="payMethods" />
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
        <div class="py-[12px] ">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
            剩余未支付:{{ unPayMoney }}
          </div>
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>

</style>
