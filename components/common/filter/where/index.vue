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
}>()
const emits = defineEmits<{
  /**
   * 提交
   * @param params 筛选结果
   */
  submit: [params: T]
}>()

/**
 * 弹出筛选
 */
const show = defineModel<boolean>('show', { default: false, required: true })

/**
 * 筛选结果
 */
const datas = ref<T>(props.data)
/**
 * 提交
 */
function submit() {
  emits('submit', datas.value)
}

/**
 * 重置
 */
function reset() {
  datas.value = {} as T
}

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
    <common-popup v-model="show" title="高级筛选">
      <div class="">
        <template v-for="(f, i) in props.filter" :key="i">
          <template v-if="f.show">
            <div class="mb-2">
              <div class="text-color">
                {{ f?.label }}
              </div>
              <div class="mt-2">
                <slot :name="f?.name" :filter="f">
                  <template v-if="f?.input === 'text'">
                    <div>
                      <n-input v-model:value="datas[f.name as string]" size="large" :placeholder="`输入${f?.label}`" round />
                    </div>
                  </template>
                  <template v-if="f?.input === 'number'">
                    <div>
                      <n-input-number v-model:value="datas[f.name as string]" size="large" :placeholder="`输入${f?.label}`" round />
                    </div>
                  </template>
                  <template v-if="f?.input === 'switch'">
                    <n-switch v-model:value="datas[f.name as string]" size="large" :style="{ 'border-radius': '20px' }" round />
                  </template>
                  <template v-if="f?.input === 'select'">
                    <n-select
                      v-model:value="datas[f.name as string]"
                      :default-value="0 || '' || undefined || null"
                      menu-size="large"
                      fable
                      :placeholder="`请选择${f?.label}`"
                      :options="presetToSelect(f) "
                    />
                  </template>
                  <template v-if="f?.input === 'textarea'">
                    <n-input v-model:value="datas[f.name as string]" :placeholder="`输入${f?.label}`" type="textarea" maxlength="255" round :autosize="{ minRows: 2, maxRows: 3 }" />
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
.footer {
  .left {
    background: #ffffff;
    box-shadow: 0px 6px 6px rgba(110, 166, 255, 0.3);
    --uno: 'text-[16px] dark:color-#2D79F0 py-[6px] border-none text-center rounded-[36px] mr-[8px]';
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
