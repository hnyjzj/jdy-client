<script lang="ts" setup generic="T">
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
   * 表单禁用
   */
  disabled?: Array<keyof T>
}>()
const emits = defineEmits<{
  /**
   * 提交
   * @param params 筛选结果
   */
  submit: [params: T]
  /**
   * 重置
   */
  reset: []
}>()

/**
 * 弹出筛选
 */
const showFilter = defineModel<boolean>('show', { default: false, required: true })

/**
 * 筛选结果
 */
const datas = ref<T>({ ...props.data })

/**
 * 初始化数据
 */
const Init = ref<T>({ ...props.data })

/**
 * 提交
 */
function submit() {
  emits('submit', datas.value)
}

/**
 * 表单唯一标识
 */
const Key = ref(useId())

/**
 * 重置
 */
function reset() {
  datas.value = { ...Init.value }
  Key.value = Date.now().toString()

  emits('reset')
}

defineExpose({
  reset,
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
</script>

<template>
  <div>
    <common-popup v-model="showFilter" title="高级筛选">
      <div :id="Key" :key="Key" class="filter-container">
        <template v-for="({ name, label, find, input }, i) in props.filter" :key="i">
          <template v-if="find">
            <div class="mb-2">
              <div class="text-color">
                {{ label }}
              </div>
              <div class="mt-2">
                <slot :name="name" :filter="props.filter[i]">
                  <template v-if="input === 'text'">
                    <div>
                      <n-input v-model:value="datas[name as string]" size="large" :placeholder="`输入${label}`" round :disabled="disabled?.includes(name)" />
                    </div>
                  </template>
                  <template v-if="input === 'number'">
                    <div>
                      <n-input-number v-model:value="datas[name as string]" size="large" :placeholder="`输入${label}`" round :disabled="disabled?.includes(name)" />
                    </div>
                  </template>
                  <template v-if="input === 'switch'">
                    <n-switch v-model:value="datas[name as string]" size="large" :style="{ 'border-radius': '20px' }" round :disabled="disabled?.includes(name)" />
                  </template>
                  <template v-if="input === 'select'">
                    <n-select
                      v-model:value="datas[name as string]"
                      :default-value="0 || '' || undefined || null"
                      menu-size="large"
                      fable
                      :placeholder="`请选择${label}`"
                      :options="presetToSelect(props.filter[i]) "
                      :disabled="disabled?.includes(name)"
                    />
                  </template>
                  <template v-if="input === 'textarea'">
                    <n-input v-model:value="datas[name as string]" :placeholder="`输入${label}`" type="textarea" maxlength="255" round :autosize="{ minRows: 2, maxRows: 3 }" :disabled="disabled?.includes(name)" />
                  </template>
                  <template v-if="input === 'date'">
                    <n-date-picker v-model:value="datas[name as string]" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" size="large" :placeholder="`选择${label}`" round clearable :disabled="disabled?.includes(name)" />
                  </template>
                </slot>
              </div>
            </div>
          </template>
        </template>
      </div>
      <template #footer>
        <div class="footer grid-12 offset-2">
          <button class="left col-span-4 offset-1 cursor-pointer" @click="reset">
            重置
          </button>
          <button class="right col-span-6 cursor-pointer" @click="submit">
            确认筛选
          </button>
        </div>
      </template>
    </common-popup>
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 20px;
}

.n-base-selection-label {
  height: 40px !important;
}

.n-input-wrapper {
  border-radius: 20px !important;
}
</style>

<style lang="scss" scoped>
.filter-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 16px;
}
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
