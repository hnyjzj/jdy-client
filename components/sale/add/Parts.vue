<script setup lang="ts">
const Props = withDefaults(defineProps<{
  isIntegral: boolean
  billingSet: BillingSet
  partFilter: Where<OrderPart>
  storeid: string
}>(), {
  isIntegral: false,
})

const orderObject = defineModel<Orders>({ default: {} as Orders })
const showModal = ref(false)
// 小数点进位计算函数
const hold = holdFunction(Props.billingSet.decimal_point)
const rounding = roundFunction(Props.billingSet.rounding)
</script>

<template>
  <div>
    <common-card-info title="配件礼品">
      <template #info>
        <div class="grid-12 p-[16px]">
          <div
            class="btn-left col-6 offset-3 cursor-pointer py-[10px]" uno-sm="col-4 offset-4" @click="showModal = true">
            <icon name="i-icon:search" color="#FFF" :size="16" />
            <div class="ml-2">
              搜索
            </div>
          </div>
        </div>

        <sale-add-parts-list
          v-model:list="orderObject"
          :hold="hold"
          :rounding="rounding"
          :is-integral="Props.isIntegral" />
        <sale-add-parts-search
          v-model:show="showModal"
          v-model:list="orderObject"
          :is-integral="Props.isIntegral"
          :billing-set="Props.billingSet"
          :storeid="Props.storeid"
          :part-filter="Props.partFilter"
        />
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
