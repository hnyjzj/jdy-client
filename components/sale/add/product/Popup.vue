<script lang="ts" setup>
const Props = defineProps<{
  searchProductList: (data: { val: string, type: string }) => Promise<ProductFinisheds[]>
}>()
const emits = defineEmits<{
  addProduct: [val: ProductFinisheds]
}>()
const showModal = defineModel('show', { default: false })
// 搜索商品 名称 和 条码   code
const searchType = ref('code')
// 选择成品
const readyAddproduct = ref()
const setAddProduct = (product: ProductFinisheds) => {
  readyAddproduct.value = product
}
const productList = ref<ProductFinisheds[]>([])
const searchProduct = ref('')
// 搜索商品时候选择名称搜索还是条码搜索
const changeType = (type: 'name' | 'code') => {
  productList.value = []
  searchType.value = type
  searchProduct.value = ''
//   emits('searchProduct') // 搜索
}

const search = async () => {
  productList.value = await Props.searchProductList({ val: searchProduct.value, type: searchType.value })
}
const confirm = () => {
  emits('addProduct', readyAddproduct.value)
  searchProduct.value = ''
  productList.value = []
}

const { useWxWork } = useWxworkStore()
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    searchProduct.value = code
    search()
  }
}
</script>

<template>
  <div>
    <common-model
      v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="confirm" @cancel="() => {
        showModal = false
        searchProduct = ''
        productList = []
      }">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex justify-start py-[12px]">
              <div
                class="flex-center-col pr-[32px]"
                @click="changeType('code')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'code' ? '#333' : '#53565C' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: searchType === 'code' ? '#2080F0' : '' }" />
              </div>
              <div
                class="flex-center-col"
                @click="changeType('name')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'name' ? '#333' : '#53565C' }">
                  名称搜索
                </div>
                <div class="w-[32px] h-[4px] rounded " :style="{ background: searchType === 'name' ? '#2080F0' : '' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                v-model:value="searchProduct"
                type="text"
                clearable
                :placeholder="searchType === 'name' ? '请输入商品名称' : '请输入商品条码'"
                @focus="focus" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="search()">
                搜索
              </n-button>
              <div class="pl-[8px]">
                <n-button strong secondary type="info" round @click="scanCode()">
                  扫码
                </n-button>
              </div>
            </div>
          </div>
          <div class="grid-12 px-[12px] color-[#333] font-semibold !text-[16px]">
            <div class="col-4">
              条码
            </div>
            <div class="col-4">
              名称
            </div>
            <div class="col-3">
              销售方式
            </div>
            <div class="col-1">
              金重
            </div>
          </div>
          <div class="h-[300px] overflow-y-auto py-[16px]">
            <template v-for="(item, index) in productList" :key="index">
              <div
                class="py-[12px] px-[8px] rounded-2xl grid-12 "
                :style="{ color: readyAddproduct && item.id === readyAddproduct.id ? '#2080F0' : '',
                          background: readyAddproduct && item.id === readyAddproduct.id ? '#fff' : '' }"
                @click="setAddProduct(item)">
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.code }}
                </div>
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.name }}
                </div>
                <div class="col-3">
                  <!-- {{ realtype(item.retail_type) }} -->
                </div>
                <div class="col-1">
                  {{ item.weight_metal }}
                </div>
              </div>
            </template>
            <template v-if="productList.length === 0">
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
