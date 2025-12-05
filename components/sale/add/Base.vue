<script lang="ts" setup>
import { calc } from 'a-calc'

const props = withDefaults(defineProps<{
  title?: string
  filterList: Where<OrderWhere>
  storeStaff: StoresStaff[]
  getStaff: () => void
}>(), {
  title: '基础信息',
})
const orderObject = defineModel<Orders>({ default: {} })
// 设置积分抵扣值
const handleIsInterChange = () => {
  if (!orderObject.value.has_integral) {
    // 清空积分
    orderObject.value.showProductList?.forEach((item) => {
      item.integral = 0
    })
    orderObject.value.showMasterialsList?.forEach((item) => {
      item.integral = 0
    })
  }
  else {
    orderObject.value.showProductList?.forEach((item) => {
      if (item.price && item.rate && Number(item.rate) !== 0) {
        // 计算应得的积分 +
        item.integral = calc('(a / b) | =0 ~5 ,!n', {
          a: item.price,
          b: item.rate,
        })
      }
      else {
        item.integral = 0
      }
    })
    orderObject.value.showMasterialsList?.forEach((item) => {
      if (item.recycle_price && item.rate && Number(item.rate) !== 0) {
        item.integral = calc('(a / b)| =0 ~5, !n', {
          a: item.recycle_price || 0,
          b: item?.rate || 0,
        })
      }
      else {
        item.integral = 0
      }
    })
  }
}

// 订单来源参数
const sourceOptions = optonsToSelect(props.filterList.source?.preset)

// 删除销售
const deleteSale = (index: number) => {
  orderObject.value.clerks?.splice(index, 1)
  const aliveMain = orderObject.value.clerks?.filter(item => item.is_main === true)
  if (!aliveMain?.length) {
    if (orderObject.value.clerks?.length) {
      orderObject.value.clerks[0].is_main = true
    }
  }
}
// 新增销售员
const addNewSale = () => {
  orderObject.value.clerks.push({
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
  orderObject.value.clerks.forEach((item) => {
    result.value += item.performance_rate || 0
  })
  if (result.value !== 100) {
    $toast.error('业绩比例总合不等于100%')
    return false
  }
}
</script>

<template>
  <div>
    <common-card-info :title="props.title">
      <template #info>
        <div class="w-auto flex flex-col" uno-lg="grid grid-cols-1 gap-x-[16px] grid-cols-0">
          <n-grid :cols="24" :x-gap="12" responsive="screen">
            <n-form-item-gi :span="12" label="收银员" path="cashier_id" class="">
              <n-select
                v-model:value="orderObject.cashier_id"
                placeholder="请输入收银员"
                :options="props.storeStaff.map(v => ({
                  label: v.nickname,
                  value: v.id,
                }))"
                clearable
                remote
                @focus="() => {
                  props.getStaff()
                }"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="来源" path="source" class="">
              <n-select
                v-model:value="orderObject.source"
                placeholder="请选择"
                :options="sourceOptions"
              />
            </n-form-item-gi>
          </n-grid>

          <template v-for="(item, index) in orderObject.clerks" :key="index">
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
              <n-radio-group v-model:value="orderObject.has_integral" name="radiogroup" @update:value="handleIsInterChange()">
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
      </template>
    </common-card-info>
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
