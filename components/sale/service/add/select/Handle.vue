<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

const props = defineProps<{
  repairGoodsFilterList: FilterWhere<serviceGoods>[]
  nowEditState?: number
}>()
const showServiceGoods = defineModel<serviceGoods[]>('list', { default: [] })
const params = defineModel<serviceGoods>('params', { default: {

} })
const { $toast } = useNuxtApp()

const showModal = defineModel<boolean>('show', { default: false })
const rules = ref<FormRules>({})
const MformRef = ref()
const forRules = () => {
  props.repairGoodsFilterList.forEach((item) => {
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
const submitServiceForm = async () => {
  MformRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (props.nowEditState !== undefined) {
        showServiceGoods.value.splice(props.nowEditState, 1, params.value)
        showModal.value = false
      }
      else {
        params.value.is_our = false

        showServiceGoods.value.push(params.value)

        showModal.value = false
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}

// 转换下拉参数
const presetToSelect = (filter: FilterWhere<serviceGoods>): { label: string, value: any }[] => {
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
    <common-model v-model="showModal" title="添加维修品" :show-ok="true" :show-cancel="true" @confirm="submitServiceForm">
      <div class="grid-12 h-[400px] overflow-y-auto">
        <div class="col-12 px-[12px]">
          <n-form ref="MformRef" :model="params" :rules="rules">
            <n-grid :cols="24" :x-gap="8">
              <template v-for="(item, index) in props.repairGoodsFilterList" :key="index">
                <template v-if="item.input !== 'list' && item.name !== 'is_our' && item.create === true">
                  <n-form-item-gi :span="12" :label="item.label" :path="item.name" :required="item.required">
                    <template v-if="item.input === 'select'">
                      <n-select
                        v-model:value="(params[item.name] as number)"
                        menu-size="large"
                        :placeholder="`选择${item.label}`"
                        :options="presetToSelect(item)"
                        clearable
                        size="large"
                        @focus="focus"
                      />
                    </template>
                    <template v-if="item.input === 'text'">
                      <n-input
                        v-model:value="(params[item.name] as string)"
                        size="large"
                        round :placeholder="`输入${item.label}`" @focus="focus"
                      />
                    </template>
                    <template
                      v-if="item.input === 'number'">
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
