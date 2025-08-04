<script setup lang="ts">
const Props = defineProps<{
  title: string
  isIntegral: boolean
  billingSet: BillingSet
  checkAccessoriesScore: (params: { classes: ProductAccessories['type'][] }) => any
  searchParts: (val: string, type: string) => Promise<ProductAccessories[]>
}>()
const emits = defineEmits<{
  clearList: []
}>()

const showPartsList = defineModel<ProductAccessories[]>('list', { default: [] })
const showModal = ref(false)

// 小数点进位计算函数
const hold = ref(0)
</script>

<template>
  <common-fold :title="Props.title" :is-collapse="false">
    <div class="p-[16px]">
      <div class="grid-12">
        <div
          class="btn-left col-6 offset-3 cursor-pointer py-[10px]" uno-sm="col-4 offset-4" @click="() => {
            emits('clearList')
            showModal = true
          }
          ">
          <icon name="i-icon:search" color="#FFF" :size="16" />
          <div class="ml-2">
            搜索
          </div>
        </div>
      </div>
    </div>

    <sale-add-parts-list
      v-model:hold="hold"
      v-model:list="showPartsList"
      :is-integral="Props.isIntegral" />
    <sale-add-parts-search
      v-model:show="showModal"
      v-model:list="showPartsList"
      v-model:hold="hold"
      :is-integral="Props.isIntegral"
      :billing-set="Props.billingSet"
      :check-accessories-score="Props.checkAccessoriesScore"
      :search-parts="Props.searchParts"
    />
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
