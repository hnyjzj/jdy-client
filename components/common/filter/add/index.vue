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
const rules = computed(() => {
  const r: Record<string, Array<any>> = {}
  props.filter.forEach((f) => {
    if (f.required && f.input !== 'switch' && f.input !== 'radio') {
      r[f.name as string] = [
        {
          required: true,
          message: `请输入${f.label}`,
          trigger: ['blur', 'change'],
        },
      ]
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

defineExpose({
  verify,
})
</script>

<template>
  <div>
    <NForm ref="formRef" :model="datas" :rules="rules">
      <n-grid :cols="24" :x-gap="16">
        <template v-for="({ name, label, create, input, condition, required }, i) in props.filter" :key="i">
          <template v-if="canShowFilter({ create, condition } as FilterWhere<T>)">
            <n-form-item-gi :span="12" :path="name" :label="label" :required="required">
              <slot :name="name" :filter="props.filter[i]">
                <template v-if="input === 'text'">
                  <n-input v-model:value="datas[name as string]" size="large" clearable :placeholder="`输入${label}`" round />
                </template>
                <template v-if="input === 'number'">
                  <n-input-number v-model:value="datas[name as string]" size="large" clearable :placeholder="`输入${label}`" round @focus="focus" />
                </template>
                <template v-if="input === 'switch'">
                  <n-switch v-model:value="datas[name as string]" :style="{ 'border-radius': '20px' }" round />
                </template>
                <template v-if="input === 'select'">
                  <n-select
                    v-model:value="datas[name as string]"
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
                  <n-input v-model:value="datas[name as string]" :placeholder="`输入${label}`" type="textarea" maxlength="255" size="large" round :autosize="{ minRows: 1, maxRows: 2 }" @focus="focus" />
                </template>
                <template v-if="input === 'date'">
                  <template v-if="name.includes('start')">
                    <n-date-picker v-model:formatted-value="datas[name as string]" default-time="00:00:00" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                  <template v-else-if="name.includes('end')">
                    <n-date-picker v-model:formatted-value="datas[name as string]" default-time="23:59:59" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                  <template v-else>
                    <n-date-picker v-model:formatted-value="datas[name as string]" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable />
                  </template>
                </template>
                <template v-if="input === 'day'">
                  <n-date-picker v-model:formatted-value="datas[name as string]" value-format="yyyy-MM-dd" type="date" size="large" :placeholder="`选择${label}`" round clearable />
                </template>

                <template v-if="input === 'multiple'">
                  <n-select
                    v-model:value="datas[name as string]"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    multiple
                    :placeholder="`请选择${label}`"
                    :options="presetToSelect(props.filter[i]) "
                    @focus="focus"
                    @clear="() => {
                      delete datas[name as string]
                    }"
                  />
                </template>
                <template v-if="input === 'radio'">
                  <n-radio-group v-model:value="datas[name as string]" name="radiogroup" @focus="focus">
                    <n-radio v-for="item in presetToSelect(props.filter[i])" :key="item.value" :value="item.value" :label="item.label" />
                  </n-radio-group>
                </template>
              </slot>
            </n-form-item-gi>
          </template>
        </template>
      </n-grid>
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
