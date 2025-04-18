<script lang="ts" setup>
const props = defineProps<{
  filterList: Where<OrderWhere>
}>()
const formData = defineModel<Orders>({ default: {} })

// 转换支付方式下拉菜单
const payMethods = optonsToSelect(props.filterList.payment_method?.preset)
const addNewMethod = () => {
  formData.value.payment_method.push({ method: undefined, money: 0 })
}
// 删除支付方式
const deleteMethod = (index: number) => {
  formData.value.payment_method.splice(index, 1)
}
// 未支付的金额
const unPayMoney = computed(() => {
  const total = ref(0)

  return total.value
})
</script>

<template>
  <div>
    <common-fold title="结算信息" :is-collapse="false">
      <div class="p-[16px]">
        <div class="border-b-[#E6E6E8] border border-b-solid pb-[16px]">
          订金金额:0.00
        </div>
        <div class="pt-[16px]">
          <template v-for="(item, index) in formData.payment_method" :key="index">
            <div>
              <n-grid :cols="24" :x-gap="8">
                <n-form-item-gi
                  :span="12"
                  label="支付方式" label-placement="top"
                >
                  <n-select
                    v-model:value="item.method" :options="payMethods" />
                </n-form-item-gi>
                <n-form-item-gi
                  :span="12"
                  label="金额" label-placement="top"
                >
                  <div class="w-full">
                    <n-input-number
                      v-model:value="item.money"
                      placeholder="支付金额"
                      round
                      min="0"
                      :show-button="false"
                    />
                  </div>
                  <div>
                    <template v-if="index === 0">
                      <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3] text-[26px]" @click="addNewMethod()">
                        +
                      </div>
                    </template>
                    <template v-if="index !== 0">
                      <div class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3]  text-[26px]" @click="deleteMethod(index)">
                        <div class="w-[10px] h-[2px] bg-[#3971F3]" />
                      </div>
                    </template>
                  </div>
                </n-form-item-gi>
              </n-grid>
            </div>
          </template>
        </div>
        <div class="border-b-[#E6E6E8] border border-b-solid py-[12px] mb-[12px]">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
            剩余未支付:{{ unPayMoney }}
          </div>
        </div>
        <n-form-item
          label="备注信息"
        >
          <n-input
            v-model:value="formData.remark"
            :style="{ '--n-border-radius': '20px' }"
            placeholder="备注信息"
            type="textarea"
          />
        </n-form-item>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>

</style>
