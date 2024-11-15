<script lang="ts" setup generic="T = object">
import type { Rule, Rules } from 'common-form'

// 表单配置
const props = defineProps<{
  rules?: Rules<T>
}>()

// 表单方法
defineEmits<{
  (e: 'submit', data: T): void
}>()

// 表单数据
const data = defineModel<T>({ required: true })

// 表单验证
const validate = (value: any, rule: Rule): boolean => {
  const { validator: type, enums } = rule
  switch (type) {
    case 'string': {
      return typeof value === 'string' && value !== ''
    }
    case 'number':{
      return typeof value === 'number' && !Number.isNaN(Number(value))
    }
    case 'boolean':{
      return typeof value === 'boolean' || value === 0 || value === 1
    }
    case 'object':{
      return typeof value === 'object'
    }
    case 'array':{
      return Array.isArray(value)
    }
    case 'date':{
      return !Number.isNaN(Date.parse(value))
    }
    case 'required':{
      return !!value
    }
    case 'email':{
      return !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value)
    }
    case 'url':{
      return /^https?:\/\/[^\s/$.?#].\S*$/.test(value)
    }
    case 'phone':{
      return /^\+?\d{10,15}$/.test(value)
    }
    case 'enum':{
      if (!enums) {
        throw new Error(`当类型为 "enum" 时，必须提供 "enums" 属性`)
      }
      return enums.includes(value)
    }
    default: {
      // 如果是函数
      if (typeof type === 'function') {
        return type(value)
      }
      // 如果是正则
      if (type instanceof RegExp) {
        return type.test(value)
      }
      throw new Error(`没有内置的类型或者没有找到对应的验证器: ${type}`)
    }
  }
}

// 表单错误集
const errors = ref<{ [K in keyof T]: string }>()

// 获取错误信息
const getError = (key: keyof T): string => {
  if (!props.rules?.[key]) {
    return ''
  }

  const rule = props.rules[key]
  const value = data.value[key]
  const errs: string[] = []

  rule.forEach((r, i) => {
    const res = validate(value, r)
    if (!res && r.message) {
      errs[i] = r.message
    }
  })

  const res = errs.filter(Boolean)[0] || ''

  if (!errors.value) {
    errors.value = {} as { [key in keyof T]: string }
  }

  errors.value[key] = res

  return res
}
</script>

<template>
  <div class="form">
    <div class="content">
      <template v-for="(value, key) in data" :key="key">
        <slot :value="value" :name="key" :label="key" :error="errors?.[key as keyof T]" :rule="props.rules?.[key as keyof T]" :validate="() => getError(key as keyof T)" />
      </template>
    </div>
    <div class="errors">
      <slot name="errors" :errors="errors" />
    </div>
    <div class="actions">
      <slot name="actions" :submit="() => $emit('submit', data)" :reset="() => { data = {} as T }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
