<script lang="ts" setup generic="T extends Record<string, any>">
import { NForm } from 'naive-ui'

const props = defineProps<{
  /**
   * 筛选结果
   */
  data: T
  /**
   * 筛选条件
   */
  filter: FilterWhere<T>[]
  /**
   * 禁用条件
   */
  disableConditions?: 'update' | 'find' | 'create'
}>()

/**
 * 表单引用
 */
const formRef = ref<InstanceType<typeof NForm> | null>(null)

/**
 * 筛选结果
 */
const datas = ref(props.data) as Ref<Record<string, any>>

/**
 * 表单规则
 */
/**
 * 表单规则
 */
const rules = computed(() => {
  const r: Record<string, any[]> = {}
  props.filter.forEach((f) => {
    if (f.required && f.input !== 'switch' && f.input !== 'radio') {
      // 动态生成消息：选择类用“请选择”，其他用“请输入”
      const isSelectType = ['select', 'multiple', 'radio', 'date', 'day'].includes(f.input as string)
      const message = isSelectType ? `请选择${f.label}` : `请输入${f.label}`

      const baseRule = {
        required: true,
        message,
        trigger: ['blur', 'change'] as const,
      }

      if (f.input === 'multiple') {
        // 自定义 validator 确保数组非空
        r[f.name as string] = [{
          ...baseRule,
          validator: (rule: any, value: any[]) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
              return new Error(message)
            }
            return Promise.resolve()
          },
        }]
      }
      else {
        r[f.name as string] = [baseRule]
      }
    }
  })
  return r
})

/**
 * 预设转换为选择项
 * @param filter 筛选条件
 */
const presetToSelect = (filter: FilterWhere<T>): { label: string, value: any }[] => {
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

const canShowFilter = (item: FilterWhere<T>) => {
  if (!item.create) {
    return false
  }

  if (item.condition) {
    return !item.condition?.some((i) => {
      switch (i.operator) {
        case '=':
          return datas.value[i.key as keyof T as string] !== i.value

        default:
          return false
      }
    })
  }

  return true
}

/**
 * 处理按钮点击
 */
const verify = async () => {
  await formRef.value?.validate()
}

function isDisabled(arr: Record<string, boolean>) {
  if (!props.disableConditions) {
    return false
  }

  const conditionIndex = ['update', 'find', 'create'].indexOf(props.disableConditions)

  return conditionIndex >= 0 ? !arr[props.disableConditions] : false
}

defineExpose({
  verify,
})
</script>

<template>
  <div>
    <NForm ref="formRef" :model="datas" :rules="rules">
      <common-layout-form>
        <template v-for="({ name, label, create, find, input, condition, required, update }, i) in props.filter" :key="i">
          <template v-if="canShowFilter({ create, condition } as FilterWhere<T>)">
            <n-form-item class="col-6" :path="name" :label="label" :required="required">
              <slot :name="name" :filter="props.filter[i]">
                <template v-if="input === 'text'">
                  <n-input v-model:value="datas[name as string]" :disabled="isDisabled({ update, find, create })" size="large" clearable :placeholder="`输入${label}`" round />
                </template>
                <template v-if="input === 'number'">
                  <n-input-number v-model:value="datas[name as string]" :disabled="isDisabled({ update, find, create })" size="large" clearable :placeholder="`输入${label}`" round />
                </template>
                <template v-if="input === 'switch'">
                  <n-switch v-model:value="datas[name as string]" :disabled="isDisabled({ update, find, create })" :style="{ 'border-radius': '20px' }" round />
                </template>
                <template v-if="input === 'select'">
                  <n-select
                    v-model:value="datas[name as string]"
                    :disabled="isDisabled({ update, find, create })"
                    clearable
                    size="large"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    :placeholder="`请选择${label}`"
                    :options="presetToSelect(props.filter[i]) "
                    @focus="focus"
                  />
                </template>
                <template v-if="input === 'textarea'">
                  <n-input v-model:value="datas[name as string]" :disabled="isDisabled({ update, find, create })" :placeholder="`输入${label}`" type="textarea" maxlength="255" size="large" round :autosize="{ minRows: 1, maxRows: 2 }" @focus="focus" />
                </template>
                <template v-if="input === 'date' || input === 'datetime'">
                  <template v-if="name.includes('start')">
                    <n-date-picker v-model:formatted-value="datas[name as string]" :disabled="isDisabled({ update })" default-time="00:00:00" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ssxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                  <template v-else-if="name.includes('end')">
                    <n-date-picker v-model:formatted-value="datas[name as string]" :disabled="isDisabled({ update, find, create })" default-time="23:59:59" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ssxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                  <template v-else>
                    <n-date-picker v-model:formatted-value="datas[name as string]" :disabled="isDisabled({ update, find, create })" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ssxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                </template>
                <template v-if="input === 'day'">
                  <n-date-picker v-model:formatted-value="datas[name as string]" :disabled="isDisabled({ update, find, create })" value-format="yyyy-MM-dd" type="date" size="large" :placeholder="`选择${label}`" round clearable />
                </template>

                <template v-if="input === 'multiple'">
                  <n-select
                    v-model:value="datas[name as string]"
                    :disabled="isDisabled({ update, find, create })"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    multiple
                    :placeholder="`请选择${label}`"
                    :options="presetToSelect(props.filter[i]) "
                    @clear="() => {
                      delete datas[name as string]
                    }"
                  />
                </template>
                <template v-if="input === 'radio'">
                  <n-radio-group v-model:value="datas[name as string]" name="radiogroup" @focus="focus">
                    <n-radio
                      v-for="item in presetToSelect(props.filter[i])"
                      :key="item.value"
                      :style="{
                        '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                        '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                        '--n-dot-color-active': '#0068ff',
                        '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }"
                      :disabled="isDisabled({ update, find, create })"
                      :value="item.value"
                      :label="item.label" />
                  </n-radio-group>
                </template>
                <slot name="info" :info="{ name, label, create, find, input, condition, required, update }" />
              </slot>
            </n-form-item>
          </template>
        </template>
      </common-layout-form>
    </NForm>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  .left {
    background: #ffffff;
    box-shadow: 0px 6px 6px rgba(110, 166, 255, 0.3);
    --uno: 'text-[16px] dark:color-#2D79F0 py-[10px] border-none text-center rounded-[36px] mr-[8px]';
  }

  .right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[6px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

<style lang="scss">
.n-form-item .n-date-picker {
  width: 100%;
}
</style>
