<script lang="ts" setup>
const props = defineProps<{
  title: string
  orderDetail: DepositOrderInfo
  searchDepositOrders: (val?: string) => Promise<DepositOrderInfo[]>
}>()
const emit = defineEmits<{
  setOrderIds: [string[]]
}>()
// 展示定金单列表
const showDepositList = defineModel<DepositOrderInfo[]>('list', { default: [] })
const selectDepositList = defineModel<DepositOrderInfo[]>('select', { default: [] })
const searchShow = ref(false)
const depositSelect = ref()
const handleBlur = () => {
  emit('setOrderIds', depositSelect.value)
  selectDepositList.value = showDepositList.value.filter(item => depositSelect.value.includes(item.id))
}

const cute = (index: number) => {
  showDepositList.value.splice(index, 1)
}
</script>

<template>
  <div>
    <common-fold :title="props.title" :is-collapse="false">
      <div class="p-[16px]">
        <div class="p-[16px]">
          <div class="grid-12">
            <div
              class="btn-left col-span-4 offset-4 cursor-pointer py-[10px]" @click="searchShow = !searchShow">
              <icon name="i-icon:search" color="#FFF" :size="12" />
              <div class="ml-2">
                搜索
              </div>
            </div>
          </div>
        </div>
        <n-checkbox-group v-model:value="depositSelect" @update:value="handleBlur">
          <div>
            <template v-for="(item, index) in showDepositList" :key="index">
              <div class="flex-between items-start pb-[8px]">
                <div>
                  <n-checkbox
                    :value="item.id"
                    :label="`订金金额${item.price_pay},订金单号:${item.id},${item.products[0]?.product_finished?.name || ''}`" :style="{
                      '--n-color-checked': '#1D6DEC',
                      '--n-border-focus': '#1D6DEC',
                      '--n-box-shadow-focus': '0 0 0 2px rgba(37, 115, 238, 0.3)',
                    }" />
                </div>
                <div
                  class="wh-[25px] flex-shrink-0 bg-[#fff] rounded-3xl flex-center-col border-[#2080F0] border-solid border text-[20px] "
                  @click="cute(index)">
                  <div class="w-[13px] h-[2px] bg-[#2080F0]" />
                </div>
              </div>
            </template>
          </div>
        </n-checkbox-group>
      </div>
    </common-fold>
    <sale-add-deposit-model
      v-model:show="searchShow"
      v-model:list="showDepositList"
      :search-deposit-orders="props.searchDepositOrders" />
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
