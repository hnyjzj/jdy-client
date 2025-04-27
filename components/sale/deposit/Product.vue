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
        <div class="grid-12 gap-[16px]">
          <div class="col-4 offset-2">
            <common-button-rounded content="选择货品" @button-click="showModal = true" />
          </div>
          <div class="col-4 offset-6">
            <common-button-rounded content="手动添加" bgc="#fff" color="#3E83F1" @button-click="handleAddProductPopup = true" />
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

</style>
