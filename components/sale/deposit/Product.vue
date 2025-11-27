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
const addProduct = async (products: ProductFinisheds[]) => {
  products.forEach((product) => {
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
  })
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
</script>

<template>
  <div>
    <common-card-info title="货品">
      <template #info>
        <div>
          <div class="btn grid-12 gap-[8px]">
            <sale-deposit-select-product :search-product-list="props.searchProductList" @add="addProduct" />
            <sale-deposit-handle-add :filter-list="props.filterList" @add-product="handleAddProductFn" />
          </div>

          <div class=" pt-[16px]">
            <sale-deposit-product-list v-model:list="showProductList" :filter-list="props.filterList" />
          </div>
        </div>
      </template>
    </common-card-info>
    <!-- 选择成品 -->
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center py-[10px]';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px]  text-[#1a6beb]  dark:color-#fff dark:border-[#fff] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
</style>
