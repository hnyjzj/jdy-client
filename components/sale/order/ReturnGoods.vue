<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

const props = defineProps<{
  productFilter: Where<ProductFinisheds>
  where: Where<OrderWhere>
  returnGoods: (req: ReturnGoods) => Promise<boolean>
  orders: OrderInfo
}>()
const showReturnGoods = ref({} as {
  goods?: orderInfoProducts
  id: string
})
const showModel = ref(false)
const formRef = ref()
const model = ref<ReturnGoods>({
  id: '',
  product_id: '',
  method: undefined,
  product_type: 0,
  price: 0,
  remark: '',
  payments: [{ payment_method: 1, amount: 0 }],
})

const rules = ref<FormRules>({
  method: {
    type: 'number',
    required: true,
    message: '请选择退货方式',
    trigger: 'change',
  },
  price: {
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
const { $toast } = useNuxtApp()
const addNewMethod = () => {
  model.value.payments.push({ payment_method: 1, amount: 0 })
}
const deleteMethod = (index: number) => {
  model.value.payments.splice(index, 1)
}
const tipsMessage = ref(false)
const handleOk = async () => {
  model.value.id = showReturnGoods.value?.id || ''
  model.value.product_id = showReturnGoods.value?.goods?.id || ''
  model.value.product_type = showReturnGoods.value?.goods?.type || 0

  const res = await props.returnGoods(model.value)
  if (res) {
    showModel.value = false
    model.value = {
      id: '',
      product_id: '',
      method: undefined,
      product_type: 0,
      price: 0,
      remark: '',
      payments: [{ payment_method: 1, amount: 0 }],
    }
  }
}
const handleCancel = () => {
  tipsMessage.value = false
}

const submit = async () => {
  formRef.value.validate(async (errors: any) => {
    if (errors) {
      $toast.error(errors[0][0].message)
    }
    else {
      if ((showReturnGoods.value?.goods?.type === GoodsType.ProductFinish) && (model.value.price !== Number(showReturnGoods.value?.goods?.finished?.price))) {
        tipsMessage.value = true
        return
      }
      if ((showReturnGoods.value?.goods?.type === GoodsType.ProductOld) && (model.value.price !== Number(showReturnGoods.value?.goods?.old?.recycle_price))) {
        tipsMessage.value = true
        return
      }
      if ((showReturnGoods.value?.goods?.type === GoodsType.ProductAccessories) && (model.value.price !== Number(showReturnGoods.value?.goods?.accessorie?.price))) {
        tipsMessage.value = true
      }
      else {
        handleOk()
      }
    }
  })
}

const titleText = computed(() => {
  return showReturnGoods.value?.goods?.type === 1 ? '成品退货' : showReturnGoods.value?.goods?.type === 2 ? '旧料退货' : '配件退货'
})
const setPrice = (index: number) => {
  showModel.value = true
  showReturnGoods.value.goods = props.orders.products[index]
  showReturnGoods.value.id = props.orders.id
  model.value.price = Number(props.orders.products[index].accessorie.price) || 0
}
defineExpose({
  setPrice,
})
</script>

<template>
  <div>
    <common-model
      v-model="showModel" :title="titleText" :show-ok="true" :show-cancel="true" @confirm="submit" @cancel="() => {
        showModel = false
        model = {
          id: '',
          product_id: '',
          method: undefined,
          product_type: 0,
          price: 0,
          remark: '',
          payments: [{ payment_method: 1, amount: 0 }],
        }
      }">
      <div>
        <template v-if="showReturnGoods?.goods?.type === GoodsType.ProductFinish">
          <common-cell label="成品名称" :value="showReturnGoods?.goods?.finished.product?.name" />
          <common-cell label="零售方式" :value="productFilter?.retail_type?.preset[showReturnGoods?.goods?.finished?.product?.retail_type!]" />
          <common-cell :label="`条码:${showReturnGoods?.goods?.finished?.product?.code}`" :value="`收款金额:${showReturnGoods?.goods?.finished?.price}`" />
        </template>
        <template v-if="showReturnGoods?.goods?.type === GoodsType.ProductOld">
          <common-cell label="旧料编号" :value="showReturnGoods?.goods?.old?.product?.id" />
          <common-cell label="金重(g)" :value="showReturnGoods?.goods?.old?.weight_metal" />
          <common-cell :label="`条码:${showReturnGoods?.goods?.old?.product?.code}`" :value="`收款金额:${showReturnGoods?.goods?.old?.recycle_price}`" />
        </template>
        <template v-if="showReturnGoods?.goods?.type === GoodsType.ProductAccessories">
          <common-cell label="配件名称" :value="showReturnGoods?.goods?.accessorie.product?.name" />
          <common-cell :label="`数量:${showReturnGoods?.goods?.accessorie?.quantity}`" />
          <common-cell :label="`编号:${showReturnGoods?.goods?.accessorie?.id}`" :value="`收款金额:${showReturnGoods?.goods?.accessorie?.price}`" />
        </template>
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
        >
          <n-grid :cols="12" :x-gap="24">
            <template v-if="showReturnGoods?.goods?.type === 1">
              <n-form-item-gi :span="6" label="退货入库方式" path="method">
                <n-select
                  v-model:value="model.method"
                  placeholder="请选择退货入库方式"
                  :options="[{ label: '成品仓', value: 1 }, { label: '旧料仓', value: 2 }]"
                  @focus="focus"
                />
              </n-form-item-gi>
            </template>
            <n-form-item-gi :span="6" label="退款金额" path="price">
              <n-input-number v-model:value="model.price" :min="0" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="备注" path="remark">
              <n-input v-model:value="model.remark" type="textarea" rows="2" placeholder="请输入退款说明" @focus="focus" />
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
                  v-model:value="item.payment_method" placeholder="请选择退款方式" :options="optonsToSelect(props.where.payment_method?.preset)" @focus="focus" />
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
                    :min="0"
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
            </template>
          </n-grid>
        </n-form>
      </div>
    </common-model>
    <common-confirm
      v-model:show="tipsMessage"
      icon="warning"
      text="收款金额与退款金额不一致"
      @submit="handleOk"
      @cancel="handleCancel"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
