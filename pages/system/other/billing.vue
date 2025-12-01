<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

useSeoMeta({
  title: '开单设置',
})
const { getBillingSetWhere, updateSet, getSetInfo } = useBillingSetStore()
const { billingSetFilterListToArray } = storeToRefs(useBillingSetStore())
const { myStore } = storeToRefs(useStores())
const formRef = ref()
const rules = ref<FormRules>({})
const model = ref({
  use_confirm: false,
} as BillingSet)
// 获取筛选条件
await getBillingSetWhere()
// 获取设置详情
const data = await getSetInfo({ store_id: myStore.value.id })
if (typeof data !== 'undefined' && data !== null) {
  model.value.decimal_point = data.decimal_point
  model.value.use_confirm = data.use_confirm
  model.value.discount_rate = data.discount_rate
  model.value.rounding = data.rounding
}

const forRules = () => {
  billingSetFilterListToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'number') {
        rules.value[item.name] = {
          type: 'number',
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'select') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'number',
        }
      }
    }
  })
}
const { $toast } = useNuxtApp()
// 循环校验规则
forRules()
// 保存
const handleValidateButtonClick = async () => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (myStore.value.id) {
        model.value.store_id = myStore.value.id
        const res = await updateSet(model.value)
        if (res) {
          $toast.success('保存成功')
        }
        else {
          $toast.error('保存失败')
        }
      }
      else {
        $toast.warning('请先选择门店')
      }
    }
  })
}
</script>

<template>
  <div class="p-[16px]">
    <common-layout-center>
      <div>
        <div class="grid-12 color-[#fff]">
          <div class="col-5 pb-[16px]" uno-sm="col-3" uno-lg="col-2">
            <product-manage-company />
          </div>
        </div>
        <common-card-info title="开单设置">
          <template #info>
            <div>
              <n-form
                ref="formRef"
                :model="model"
                label-placement="left"
                label-width="150px"
                require-mark-placement="right-hanging"
                :rules="rules"
              >
                <template v-for="(item, index) in billingSetFilterListToArray" :key="index">
                  <template v-if="item.create">
                    <n-form-item :label="item.label" :path="item.name">
                      <template v-if="item.input === 'select' && item.name !== 'store_id'">
                        <n-select
                          v-model:value="(model[item.name] as number)"
                          :options="optonsToSelect(item.preset)"
                          :placeholder="item.label" @focus="focus" />
                      </template>
                      <template v-if="item.input === 'text' && item.name === 'discount_rate'">
                        <n-input v-model:value="model[item.name]" :placeholder="item.label" @focus="focus">
                          <template #suffix>
                            积分 = 1元
                          </template>
                        </n-input>
                      </template>

                      <template v-if="item.input === 'switch'">
                        <n-switch v-model:value="model[item.name]" :default-value="false" />
                      </template>
                    </n-form-item>
                  </template>
                </template>

                <div class="flex justify-center">
                  <common-button-rounded content="保存" padding="10px 100px" @button-click="handleValidateButtonClick" />
                </div>
              </n-form>
            </div>
          </template>
        </common-card-info>
      </div>
    </common-layout-center>
  </div>
</template>
