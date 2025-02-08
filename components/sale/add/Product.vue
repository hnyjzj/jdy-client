<script setup lang="ts">
const emits = defineEmits<{
  search: [val: string, type: string]
}>()
const { productList } = storeToRefs(useProductManage())
const showProductList = defineModel<OrderProduct[]>({ default: [] })
const showModal = ref(false)
const searchProduct = ref('')

// 搜索商品 名称 和 条码   code
const searchType = ref('name')
// 添加商品
const addProduct = (product: Product) => {
  // 判断是否已经添加过该商品,如果已经添加过,则数量加一
  const index = showProductList.value.findIndex(item => item.id === product.id)
  if (index !== -1 && showProductList.value[index].quantity) {
    showProductList.value[index].quantity++
    return
  }
  else if (
    // 如果没添加 并且数量为空,则数量为1
    index !== -1 && !showProductList.value[index].quantity
  ) {
    showProductList.value[index].quantity = 1
    return
  }
  showProductList.value.push({ ...product, quantity: 1, discount: undefined, payable_amount: 0 })
}
</script>

<template>
  <common-fold title="产品信息" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12 gap-[20px]">
        <div
          class="btn-left col-span-4 offset-2 cursor-pointer" @click="() => {
            productList = []
            showModal = true
          }">
          <icon name="i-icon:search" color="#fff" :size="12" />
          <div class="ml-2">
            搜商品
          </div>
        </div>
        <div
          class="btn-right col-span-4 cursor-pointer"
        >
          <icon name="i-icon:scanit" color="#1a6beb" :size="12" />
          <div class="ml-2">
            扫商品
          </div>
        </div>
      </div>
    </div>
    <template v-if="false">
      <div class="flex justify-center">
        <div class="w-[30%]">
          <common-empty :show-r-t="false" />
        </div>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        :bordered="false"
      >
        <div class="flex py-[12px] items-center">
          <div class="pr-[20px] text-[16px]">
            搜商品
          </div>
          <div class="flex">
            <div class="px-[8px] py-[4px] rounded-3xl mr-[8px]" :style="{ backgroundColor: searchType === 'name' ? '#2080F0' : '#F3F3F3', color: searchType === 'name' ? '#fff' : '#000' } " @click="searchType = 'name'">
              名称
            </div>
            <div class="px-[8px] py-[4px] rounded-3xl" :style="{ backgroundColor: searchType === 'code' ? '#2080F0' : '#F3F3F3', color: searchType === 'code' ? '#fff' : '#000' } " @click="searchType = 'code'">
              条码
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex-1">
            <n-input v-model:value="searchProduct" type="text" :placeholder="searchType === 'name' ? '请输入商品名称' : '请输入商品条码'" />
          </div>
          <div class="pl-[16px]">
            <n-button type="info" @click="emits('search', searchProduct, searchType)">
              搜索商品
            </n-button>
          </div>
        </div>
        <div class="pt-[20px]">
          <template v-for="(item, index) in productList" :key="index">
            <div class="py-[6px] flex justify-between items-center">
              <div>{{ item.name }} -- {{ item.code }}</div>
              <n-button size="small" strong secondary round type="info" @click="addProduct(item)">
                添加
              </n-button>
            </div>
          </template>
        </div>
        <template #footer />
      </n-card>
    </n-modal>
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] py-[8px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[8px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
.product {
  --uno: 'w-[150px] h-[150px] rounded-[50%] relative';
  box-shadow: rgba(239, 242, 255, 1) 0 5px 20px 0;
  .bag {
    --uno: 'absolute top-[26px] left-[14px]';
  }
  .super {
    --uno: 'absolute top-[14px] right-[14px]';
    &-bg {
      --uno: 'w-[36px] h-[36px] rounded-[50%] bg-[#FFFFFF] flex justify-center items-center';
      background: linear-gradient(to bottom, rgba(255, 152, 152, 1), rgba(255, 79, 79, 1));
      box-shadow: 0 0 20px 2px rgba(255, 152, 152, 1);
    }
  }
}
</style>
