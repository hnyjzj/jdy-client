<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

const props = defineProps<{
  where: Where<OrderWhere>
  showReturnGoods?: { Finished: ProductFinished, id: string, FinishedType: number }
  returnGoods: (req: ReturnGoods) => void
}>()

const showModel = defineModel('show', { default: false })
const formRef = ref()
const model = ref<ReturnGoods>({
  id: '',
  product_id: '',
  method: 1,
  product_type: 0,
  price: 0,
  remark: '',
  payments: [{ payment_method: 1, amount: 0 }],
})
const rules = ref<FormRules>({
  returnMothed: {
    type: 'number',
    required: true,
    message: '请选择退货方式',
    trigger: 'change',
  },
  returnMoney: {
    type: 'number',
    required: true,
    message: '输入退款金额',
    trigger: 'change',
  },
  remark: {
    required: true,
    message: '请输入备注',
    trigger: 'change',
  },
})

const addNewMethod = () => {
  model.value.payments.push({ payment_method: 1, amount: 0 })
}
const deleteMethod = (index: number) => {
  model.value.payments.splice(index, 1)
}

const submit = async () => {
  formRef.value.validate(async (errors: Error) => {
    if (errors) {
      console.log(123)
    }
    else {
      model.value.id = props.showReturnGoods?.id || ''
      model.value.product_id = props.showReturnGoods?.Finished?.id || ''
      model.value.product_type = props.showReturnGoods?.FinishedType || 0
      console.log(model.value)
      await props.returnGoods(model.value)
    }
  })
}
</script>

<template>
  <div>
    <common-model v-model="showModel" title="成品退货" :show-ok="true" :show-cancel="true" @confirm="submit" @cancel="showModel = false">
      <div>
        <common-cell label="成品名称" :value="props.showReturnGoods?.Finished.product?.name" />
        <common-cell label="销售方式" :value="props.showReturnGoods?.Finished?.product?.retail_type" />
        <common-cell :label="`条码:${props.showReturnGoods?.Finished.product?.code}`" :value="`应付金额:${props.showReturnGoods?.Finished.price}`" />
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
        >
          <n-grid :cols="12" :x-gap="24">
            <n-form-item-gi :span="6" label="退货入库方式" path="method">
              <n-select
                v-model:value="model.method"
                placeholder="请选择退货入库方式"
                :options="[{ label: '成品仓', value: 1 }, { label: '旧料仓', value: 2 }]"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="退款金额" path="price">
              <n-input-number v-model:value="model.price" min="0" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="备注" path="remark">
              <n-input v-model:value="model.remark" type="textarea" rows="2" placeholder="请输入退款说明" />
            </n-form-item-gi>
            <template v-for="(item, index) in model.payments" :key="index">
              <n-form-item-gi
                :span="6"
                label="退款方式" label-placement="top"
                :path="`payments[${index}].payment_method`"
                :rule="{
                  type: 'number',
                  required: true,
                  message: `请选择退款方式`,
                  trigger: ['change', 'blur'],
                }"
              >
                <n-select
                  v-model:value="item.payment_method" placeholder="请选择退款方式" :options="optonsToSelect(props.where.payment_method?.preset)" />
              </n-form-item-gi>
              <n-form-item-gi
                :span="6"
                label="金额" label-placement="top"
              >
                <div class="w-full">
                  <n-input-number
                    v-model:value="item.amount"
                    placeholder="退款金额"
                    round
                    min="0"
                    :show-button="false"
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
            </template>
          </n-grid>
        </n-form>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
