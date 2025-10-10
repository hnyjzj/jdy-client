<script lang="ts" setup>
import type { FormRules } from 'naive-ui'
import { calc } from 'a-calc'

const props = defineProps<{
  oldFilterListToArray: FilterWhere<OrderMaterial>[]
  nowEditState?: number
  checkOldClass: (nowOldMaster: Partial<OrderMaterial>) => any
  billingSet: BillingSet
}>()
const { $toast } = useNuxtApp()
const orderObject = defineModel<Orders>({ default: {} as Orders })
const nowOldMaster = defineModel('nowOldMaster', { default: {} as OrderMaterial })
const showModal = defineModel<boolean>('show', { default: false })
const rules = ref<FormRules>({})
const MformRef = ref()
const forRules = () => {
  props.oldFilterListToArray.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        if (item.type === 'string') {
          rules.value[item.name] = {
            required: true,
            trigger: ['blur', 'input', 'change'],
            message: `请输入${item.label}`,
          }
        }
        else {
          rules.value[item.name] = {
            type: 'number',
            required: true,
            trigger: ['blur', 'input', 'change'],
            message: `请输入${item.label}`,
          }
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
      if (item.input === 'switch') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur'],
          message: `请选择${item.label}`,
          type: 'boolean',
        }
      }
    }
  })
}
// 循环校验规则
forRules()

const tipsMessage = ref(false)
const handleOk = async () => {
  // 获取旧料的积分比例  大类要有 , 积分有回收金额则计算，且比例不能等于 0 否则会NaN
  const data = await props.checkOldClass({ material: nowOldMaster.value.material, quality: nowOldMaster.value.quality, gem: nowOldMaster.value.gem })
  if (!data.res.value) {
    return
  }
  nowOldMaster.value.class = data?.res.value
  // 如果有回收金额则计算积分 并且 积分比例不能等于 0 否则会NaN
  if (nowOldMaster.value.recycle_price && data.rate && Number(data.rate) !== 0) {
    nowOldMaster.value.integral = orderObject.value.has_integral
      ? calc('(a / b)| =0 ~5, !n', {
          a: nowOldMaster.value.recycle_price,
          b: data.rate,
        })
      : 0
  }
  if (props.nowEditState !== undefined) {
    // 编辑时
    orderObject.value.showMasterialsList?.splice(props.nowEditState, 1, nowOldMaster.value)
  }
  else {
    nowOldMaster.value.is_our = false
    nowOldMaster.value.rate = data?.rate
    if (!orderObject.value.showMasterialsList) {
      orderObject.value.showMasterialsList = []
    }
    orderObject.value.showMasterialsList?.push(nowOldMaster.value)
  }

  showModal.value = false
}
const handleCancel = () => {
  tipsMessage.value = false
}
// 手动添加旧料
const submitMasterialsForm = async () => {
  MformRef.value?.validate(async (errors: any) => {
    if (!errors) {
      tipsMessage.value = true
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
// 手动添加的旧料 如果不是自有旧料
const changePrice = () => {
  if (!nowOldMaster.value.recycle_price_labor_method) {
    nowOldMaster.value.recycle_price_labor_method ??= 1
  }
  const hold = holdFunction(props.billingSet.decimal_point)
  // 取整控制函数
  const rounding = roundFunction(props.billingSet.rounding)
  if (nowOldMaster.value.recycle_price_labor_method === 1) {
    // 如果回收工费方式按克 (回收金价-回收工费)*金重*实际成色
    nowOldMaster.value.recycle_price = calc(`((b - c) * a * d)| =${hold} ~${rounding},!n`, {
      a: nowOldMaster.value.weight_metal || 0,
      b: nowOldMaster.value.recycle_price_gold || 0,
      c: nowOldMaster.value.recycle_price_labor || 0,
      d: nowOldMaster.value.quality_actual || 1,
    })
  }
  else if (nowOldMaster.value.recycle_price_labor_method === 2) {
    // 如果回收工费方式按件 (金重* 回收金价 * 实际成色) - 回收工费
    nowOldMaster.value.recycle_price = calc(`((a*b*d) - c)| =${hold} ~${rounding},!n`, {
      a: nowOldMaster.value.weight_metal || 0,
      b: nowOldMaster.value.recycle_price_gold || 0,
      c: nowOldMaster.value.recycle_price_labor || 0,
      d: nowOldMaster.value.quality_actual || 1,
    })
  }
}
// 转换下拉参数
const presetToSelect = (filter: FilterWhere<OrderMaterial>): { label: string, value: any }[] => {
  if (!filter.preset) {
    return []
  }
  return Object.keys(filter.preset).map((key) => {
    switch (filter.type) {
      case 'number':
        return {
          label: filter.preset[key],
          value: Number(key),
        }
      default:
        return {
          label: filter.preset[key],
          value: key,
        }
    }
  })
}
</script>

<template>
  <div>
    <common-model v-model="showModal" title="添加旧料" :show-ok="true" :show-cancel="true" @confirm="submitMasterialsForm">
      <div class="grid-12 h-[300px] overflow-y-scroll">
        <div class="col-12 px-[12px]">
          <n-form ref="MformRef" :model="nowOldMaster" :rules="rules">
            <n-grid :cols="24" :x-gap="8">
              <template v-for="(item, index) in props.oldFilterListToArray" :key="index">
                <template v-if="item.input !== 'list' && item.name !== 'is_our' && item.create === true">
                  <n-form-item-gi :span="12" :label="item.label" :path="item.name" :required="item.required">
                    <template v-if="item.input === 'select'">
                      <template v-if="item.name === 'recycle_price_labor_method'">
                        <n-select
                          v-model:value="(nowOldMaster[item.name] as number)"
                          size="large"
                          :placeholder="`选择${item.label}`"
                          :options="presetToSelect(item)"
                          clearable
                          @focus="focus"
                          @update:value="changePrice()"
                        />
                      </template>
                      <template v-else>
                        <n-select
                          v-model:value="(nowOldMaster[item.name] as number)"
                          size="large"
                          :placeholder="`选择${item.label}`"
                          :options="presetToSelect(item)"
                          :disabled="props.nowEditState === index && item.name === 'recycle_method'"
                          clearable
                          @focus="focus"
                        />
                      </template>
                    </template>
                    <!-- input 输入框 -->
                    <template v-if="item.input === 'text'">
                      <!-- type 字符串输入框 -->
                      <template v-if="item.type === 'string'">
                        <n-input
                          v-model:value="(nowOldMaster[item.name] as string)"
                          size="large" round :placeholder="`输入${item.label}`"
                          @focus="focus"
                        />
                      </template>
                      <!-- type number 输入框 -->
                      <template v-if="item.type === 'float'">
                        <template
                          v-if="item.name === 'weight_metal'
                            || item.name === 'recycle_price_gold' || item.name === 'recycle_price_labor' ">
                          <n-input-number
                            v-model:value="(nowOldMaster[item.name] as number)"
                            size="large"
                            round :placeholder="`输入${item.label}`"
                            :show-button="false"
                            :min="0"
                            @focus="focus" @blur="changePrice()" />
                        </template>
                        <template v-else-if="item.name === 'quality_actual'">
                          <n-input-number
                            v-model:value="(nowOldMaster[item.name] as number)"
                            size="large"
                            :max="1"
                            :min="0"
                            round :placeholder="`输入${item.label}`" :show-button="false"
                            @focus="focus" @blur="changePrice()" />
                        </template>
                        <template v-else-if="item.name === 'recycle_price'">
                          <n-input-number
                            v-model:value="(nowOldMaster[item.name] as number)"
                            size="large"
                            :min="0"
                            round :placeholder="`输入${item.label}`" :show-button="false"
                            @focus="focus" />
                        </template>
                        <template v-else>
                          <n-input-number
                            v-model:value="(nowOldMaster[item.name] as number)"
                            size="large"
                            :min="0"
                            round :placeholder="`输入${item.label}`" :show-button="false"
                            @focus="focus" />
                        </template>
                      </template>
                    </template>
                    <template v-if="item.input === 'number'">
                      <n-input-number
                        v-model:value="(nowOldMaster[item.name] as number)"
                        size="large"
                        :min="0"
                        round :placeholder="`输入${item.label}`" :show-button="false"
                        @focus="focus" />
                    </template>
                    <template v-if="item.input === 'textarea'">
                      <n-input v-model:value="(nowOldMaster[item.name] as string)" rows="1" type="textarea" size="large" @focus="focus" />
                    </template>
                  </n-form-item-gi>
                </template>
              </template>
            </n-grid>
          </n-form>
        </div>
      </div>
    </common-model>
    <common-confirm
      v-model:show="tipsMessage"
      icon="warning"
      :text="`确认回收金额为${nowOldMaster.recycle_price}吗？`"
      @submit="handleOk"
      @cancel="handleCancel"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
