<script lang="ts" setup>
// 订金单成品选择模块
const props = defineProps<{
  searchProductList: (str: string) => Promise< ProductFinisheds[]>
  filterList: Where<ProductFinisheds>
}>()

const { $toast } = useNuxtApp()
const showModal = ref(false)
const showProductList = defineModel<DepositOrderProduct[]>({ default: [] })

// 添加商品
const addProduct = async (product: ProductFinisheds) => {
  const index = showProductList.value.findIndex(item => item.product_id === product.id)
  if (index !== -1) {
    $toast.error('该商品已经添加过')
    return
  }
  //   添加成品到列表中
  if (index === -1) {
    const data = {
      is_our: true,
      price: 0,
      price_gold: 0,
      product_id: '',
      product_demand: undefined,
      product,
    }
    data.product_id = product.id

    showProductList.value.push(data)
    showModal.value = false
  }
  else {
    $toast.error('该商品已经添加过')
  }
}
const handleAddProductFn = (value: DepositOrderProduct) => {
  const data = {
    is_our: false,
    price: 0,
    price_gold: 0,
    product_id: undefined,
    ...value,
  }
  showProductList.value.push(data)
  showModal.value = false
}

const handleAddProductPopup = ref(false)
</script>

<template>
  <div>
    <common-fold title="货品" :is-collapse="false">
      <div class="p-[16px]">
        <div class="btn grid-12 gap-[8px]">
          <div
            class="btn-left col-6 cursor-pointer" uno-sm="col-4 offset-2" @click="showModal = true">
            <icon name="i-icon:search" color="#fff" :size="12" />
            <div class="ml-2">
              搜索
            </div>
          </div>
          <div
            class="btn-right  col-6 cursor-pointer" uno-sm="col-4 offset-6" @click="handleAddProductPopup = true">
            <div class="ml-2">
              手动添加
            </div>
          </div>
        </div>

        <div class=" pt-[16px]">
          <sale-deposit-product-list v-model:list="showProductList" :filter-list="props.filterList" />
        </div>
      </div>
    </common-fold>
    <!-- 选择成品 -->
    <sale-deposit-select-product v-model:show="showModal" :search-product-list="props.searchProductList" @add="addProduct" />
    <sale-deposit-handle-add v-model:show="handleAddProductPopup" :filter-list="props.filterList" @add-product="handleAddProductFn" />
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center py-[10px]';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
</style>
