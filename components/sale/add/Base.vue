<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
  filterList: Where<OrderWhere>
  storeStaff: StoresStaff[]
  getStaff: () => void
  setScore: (score: number) => void
}>(), {
  title: '基础信息',
})
const formData = defineModel<Orders>({ default: {} })
const has_integral = defineModel<boolean>('integral', { default: true })

// 订单来源参数
const sourceOptions = optonsToSelect(props.filterList.source?.preset)

// 删除销售
const deleteSale = (index: number) => {
  formData.value.clerks?.splice(index, 1)
  const aliveMain = formData.value.clerks?.filter(item => item.is_main === true)
  if (!aliveMain?.length) {
    formData.value.clerks[0].is_main = true
  }
}
// 新增销售员
const addNewSale = () => {
  formData.value.clerks.push({
    salesman_id: '',
    performance_amount: 0,
    performance_rate: 0,
    is_main: false,
  })
}

const { $toast } = useNuxtApp()

// 检查比例
const checkRatio = () => {
  const result = ref(0)
  formData.value.clerks.forEach((item) => {
    result.value += item.performance_rate || 0
  })
  if (result.value > 100) {
    $toast.error('业绩比例总合不能超过100%')
    return false
  }
}
</script>

<template>
  <div>
    <common-fold :title="props.title" :is-collapse="false">
      <div class="p-[16px] w-auto flex flex-col" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi :span="12" label="收银员" path="cashier_id" class="">
            <n-select
              v-model:value="formData.cashier_id"
              placeholder="请输入收银员"
              :options="props.storeStaff.map(v => ({
                label: v.nickname,
                value: v.id,
              }))"
              clearable
              remote
              @focus="() => {
                focus
                props.getStaff()
              }"
            />
          </n-form-item-gi>

          <n-form-item-gi :span="12" label="来源" path="source" class="">
            <n-select
              v-model:value="formData.source"
              placeholder="请选择"
              :options="sourceOptions"
              @focus="focus"
            />
          </n-form-item-gi>
        </n-grid>

        <template v-for="(item, index) in formData.clerks" :key="index">
          <div class="">
            <n-grid :cols="24" :x-gap="8">
              <n-form-item-gi
                :span="12"
                :label="item.is_main ? '主销' : '辅销'" label-placement="top" class=""
                :path="`clerks[${index}].salesman_id`"
                :rule="{
                  required: true,
                  message: `请选择导购员`,
                  trigger: ['change', 'blur'],
                }">
                <n-select
                  v-model:value="item.salesman_id"
                  placeholder="请选择"
                  :options="props.storeStaff.map(v => ({
                    label: v.nickname,
                    value: v.id,
                  }))"
                  clearable
                  remote
                  @focus="() => {
                    focus
                    props.getStaff()
                  }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="业绩比例" path="performance_rate" label-placement="top">
                <div class="w-full">
                  <n-input-number v-model:value="item.performance_rate" :min="0" :max="100" :show-button="false" @focus="focus" @blur="checkRatio()">
                    <template #suffix>
                      %
                    </template>
                  </n-input-number>
                </div>
                <div>
                  <template v-if="index === 0">
                    <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3] text-[26px]" @click="addNewSale()">
                      +
                    </div>
                  </template>
                  <template v-if="index !== 0">
                    <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3]  text-[26px]" @click="deleteSale(index)">
                      <div class="w-[10px] h-[2px] bg-[#3971F3]" />
                    </div>
                  </template>
                </div>
              </n-form-item-gi>
            </n-grid>

            <div />
          </div>
        </template>
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi
            :span="12"
            label="是否积分" label-placement="top"
          >
            <n-radio-group v-model:value="has_integral" name="radiogroup" @update:value="props.setScore">
              <n-space>
                <n-radio
                  v-for="(items, index) in [{ value: true, label: '积分' }, { value: false, label: '不积分' }]" :key="index" :value="items.value" :style="{
                    '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                    '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                    '--n-dot-color-active': '#0068ff',
                    '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                  {{ items.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-gi>
        </n-grid>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col gap-[8px]';

  .inplabel {
    --uno: 'color-[#333] dark:text-[#FFFFFF] font-size-[14px]';
  }
}
.n-input-number {
  width: 100%;
}
</style>
