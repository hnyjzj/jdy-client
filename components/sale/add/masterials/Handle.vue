<script lang="ts" setup>
import type { FormRules } from 'naive-ui'
import { calc } from 'a-calc'

const props = defineProps<{
  oldFilterListToArray: FilterWhere<ProductOld>[]
  isIntegral: boolean
  nowEditState?: number
  checkOldClass: (params: Partial<ProductOld>) => any
}>()
const showMasterialsList = defineModel<ProductOld[]>('list', { default: [] })
const params = defineModel<ProductOld>('params', { default: {

} })
const { $toast } = useNuxtApp()
// 禁用选择表单的是否自产

const showModal = defineModel<boolean>('show', { default: false })
const rules = ref<FormRules>({})
const MformRef = ref()
const forRules = () => {
  props.oldFilterListToArray.forEach((item) => {
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
// 手动添加旧料
const submitMasterialsForm = async () => {
  MformRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (props.nowEditState !== undefined) {
        // 编辑时
        if (params.value.recycle_price < 0) {
          $toast.error('回收金额不能小于0')
          return
        }

        // 获取旧料的积分比例  大类要有 , 积分有回收金额则计算，且比例不能等于 0 否则会NaN
        const data = await props.checkOldClass({ material: params.value.material, quality: params.value.quality, gem: params.value.gem })
        if (!data.res.value) {
          // 如果没有大类则中断
          return
        }

        params.value.class = data?.res.value
        // 如果有回收金额则计算积分 并且 积分比例不能等于 0 否则会NaN
        if (params.value.recycle_price && data.rate && Number(data.rate) !== 0) {
          params.value.integral = props.isIntegral
            ? calc('(a / b)| =0 ~5, !n', {
                a: params.value.recycle_price,
                b: data.rate,
              })
            : 0
        }
        showMasterialsList.value.splice(props.nowEditState, 1, params.value)
        showModal.value = false
      }
      else {
        params.value.is_our = false
        if (params.value.recycle_price < 0) {
          $toast.error('回收金额不能小于0')
          return
        }
        // 获取旧料的积分比例  大类要有 , 积分有回收金额则计算，且比例不能等于 0 否则会NaN
        const data = await props.checkOldClass({ material: params.value.material, quality: params.value.quality, gem: params.value.gem })
        if (!data.res.value) {
          // 如果没有大类则中断
          return
        }
        params.value.rate = data?.rate
        params.value.class = data?.res.value
        // 如果有回收金额则计算积分 并且 积分比例不能等于 0 否则会NaN
        if (params.value.recycle_price && data.rate && Number(data.rate) !== 0) {
          params.value.integral = props.isIntegral
            ? calc('(a / b)| =0 ~5, !n', {
                a: params.value.recycle_price,
                b: data.rate,
              })
            : 0
        }
        showMasterialsList.value.push(params.value)

        showModal.value = false
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
// 手动添加的旧料 如果不是自有旧料
const changePrice = (name: string) => {
  if (!params.value.recycle_price_labor_method) {
    params.value.recycle_price_labor_method = 1
  }
  // 如果回收金额确认了 则反推金价
  if (name === 'recycle_price') {
    if (params.value.weight_metal && params.value.quality_actual && params.value.recycle_price) {
      params.value.recycle_price_gold = calc('( c + ( e / (a* d))) |=0 ~5,!n', {
        a: params.value.weight_metal,
        e: params.value.recycle_price,
        c: params.value.recycle_price_labor || 0,
        d: params.value.quality_actual || 1,
      })
    }
    if (params.value.weight_metal && params.value.quality_actual && params.value.recycle_price && params.value.recycle_price_labor_method === 2) {
      params.value.recycle_price_gold = calc('((c+e)/(a*d)) |=0 ~5,!n', {
        a: params.value.weight_metal,
        e: params.value.recycle_price,
        c: params.value.recycle_price_labor || 0,
        d: params.value.quality_actual || 1,
      })
    }
    return
  }
  // 如果回收工费方式按克 (回收金价-回收工费)*金重*实际成色
  if (params.value.recycle_price_labor_method === 1) {
    params.value.recycle_price = calc('((b - c) * a * d)| =0 ~5,!n', {
      a: params.value.weight_metal || 0,
      b: params.value.recycle_price_gold || 0,
      c: params.value.recycle_price_labor || 0,
      d: params.value.quality_actual || 1,
    })
  }
  else if (params.value.recycle_price_labor_method === 2) {
    // 如果回收工费方式按件 (金重* 回收金价 * 实际成色) - 回收工费
    params.value.recycle_price = calc('((a*b*d) - c)| =0 ~5,!n', {
      a: params.value.weight_metal || 0,
      b: params.value.recycle_price_gold || 0,
      c: params.value.recycle_price_labor || 0,
      d: params.value.quality_actual || 1,
    })
  }
}
// 转换下拉参数
const presetToSelect = (filter: FilterWhere<ProductOld>): { label: string, value: any }[] => {
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
          <n-form ref="MformRef" :model="params" :rules="rules">
            <n-grid :cols="24" :x-gap="8">
              <template v-for="(item, index) in props.oldFilterListToArray" :key="index">
                <template v-if="item.input !== 'list' && item.name !== 'is_our' && item.create === true">
                  <n-form-item-gi :span="12" :label="item.label" :path="item.name" :required="item.required">
                    <template v-if="item.input === 'select'">
                      <n-select
                        v-model:value="(params[item.name] as number)"
                        size="large"
                        :placeholder="`选择${item.label}`"
                        :options="presetToSelect(item)"
                        :disabled="props.nowEditState === index && item.name === 'recycle_method'"
                        clearable
                        @focus="focus"
                      />
                    </template>
                    <template v-if="item.input === 'text'">
                      <n-input
                        v-model:value="(params[item.name] as string)"
                        size="large" round :placeholder="`输入${item.label}`"
                        @focus="focus"
                      />
                    </template>
                    <template
                      v-if="item.input === 'number' && (item.name === 'weight_metal'
                        || item.name === 'recycle_price_gold' || item.name === 'recycle_price_labor' || item.name === 'quality_actual')">
                      <n-input-number
                        v-model:value="(params[item.name] as number)"
                        size="large"
                        round :placeholder="`输入${item.label}`" :max="item.name === 'quality_actual' ? 1 : undefined"
                        :show-button="false"
                        @focus="focus" @blur="changePrice(item.name)" />
                    </template>
                    <template
                      v-if="item.input === 'number' && (item.name === 'recycle_price')">
                      <n-input-number
                        v-model:value="(params[item.name] as number)"
                        size="large"
                        round :placeholder="`输入${item.label}`" :show-button="false"
                        @focus="focus" @blur="changePrice(item.name)" />
                    </template>
                    <template
                      v-if="item.input === 'number' && (item.name !== 'weight_metal'
                        && item.name !== 'recycle_price_gold' && item.name !== 'recycle_price_labor' && item.name !== 'quality_actual' && item.name !== 'recycle_price')">
                      <n-input-number
                        v-model:value="(params[item.name] as number)"
                        size="large"
                        round :placeholder="`输入${item.label}`" :show-button="false"
                        @focus="focus" />
                    </template>
                    <template v-if="item.input === 'textarea'">
                      <n-input v-model:value="(params[item.name] as string)" rows="1" type="textarea" size="large" @focus="focus" />
                    </template>
                  </n-form-item-gi>
                </template>
              </template>
            </n-grid>
          </n-form>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
