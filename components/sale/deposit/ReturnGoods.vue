<script lang="ts" setup>
import type { FormRules } from 'naive-ui'
/**
 *  订金单退货
 */
const props = defineProps<{
  where: Where<DepositOrderWhere>
  showReturnGoods?: {
    Finished: DepositOrderInfoProducts
    id: string
  }
  returnGoods: (req: DepositReturnGoods) => Promise<boolean>
}>()

const showModel = defineModel('show', { default: false })
const formRef = ref()
const model = ref<DepositReturnGoods>({
  id: '',
  product_id: '',
  remark: '',
  payments: [{ payment_method: 1, amount: 0 }],
})

const rules = ref<FormRules>({
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
const {
  $toast,
} = useNuxtApp()
const submit = async () => {
  formRef.value.validate(async (errors: any) => {
    if (errors) {
      $toast.error(errors[0][0].message)
    }
    else {
      model.value.id = props.showReturnGoods?.id || ''
      model.value.product_id = props.showReturnGoods?.Finished?.id || ''
      const res = await props.returnGoods(model.value)
      if (res) {
        $toast.success('退货成功')
        showModel.value = false
      }
      else {
        $toast.error('退货失败')
      }
      model.value = {
        id: '',
        product_id: '',
        remark: '',
        payments: [{ payment_method: 1, amount: 0 }],
      }
    }
  })
}
</script>

<template>
  <div>
    <common-model
      v-model="showModel" title="退货" :show-ok="true" :show-cancel="true" @confirm="submit" @cancel="() => {
        showModel = false
        model = {
          id: '',
          product_id: '',
          remark: '',
          payments: [{ payment_method: 1, amount: 0 }],
        }
      }">
      <div>
        <template v-if="props.showReturnGoods?.Finished?.is_our">
          <common-cell label="货品名称" :value="props.showReturnGoods?.Finished?.product_finished?.name" />
          <common-cell label="货品条码" :value="props.showReturnGoods?.Finished?.product_finished?.code" />
          <common-cell label="销售方式" :value="props.showReturnGoods?.Finished?.product_finished?.retail_type" />
          <common-cell :label="`订金金额:${props.showReturnGoods?.Finished?.price}`" :value="`退款金额:${props.showReturnGoods?.Finished?.price}`" />
        </template>
        <template v-else>
          <common-cell label="货品名称" :value="props.showReturnGoods?.Finished?.product_demand?.name" />
          <common-cell :label="`订金金额:${props.showReturnGoods?.Finished?.price}`" :value="`退款金额:${props.showReturnGoods?.Finished?.price}`" />
        </template>
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
        >
          <n-grid :cols="12" :x-gap="24">
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
