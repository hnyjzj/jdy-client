<script lang="ts" setup>
const Props = defineProps<{
  searchProductList: (data: { val: string, type: string }) => Promise<ProductFinisheds[]>
}>()
const emits = defineEmits<{
  addProduct: [val: ProductFinisheds[]]
}>()
const showModal = defineModel('show', { default: false })
// 搜索商品 名称 和 条码   code
const searchType = ref('code')
// 选择成品
const readyAddproduct = ref([] as ProductFinisheds[])
const setAddProduct = (product: ProductFinisheds) => {
  const index = readyAddproduct.value.findIndex(p => p.id === product.id) // 假设每个产品都有一个唯一的 id 属性
  if (index !== -1) {
    // 如果产品已存在，则从数组中移除
    readyAddproduct.value.splice(index, 1)
  }
  else {
    // 如果产品不存在，则添加进数组
    readyAddproduct.value.push(product)
  }
}
const productList = ref<ProductFinisheds[]>([])
const searchProduct = ref('')

const search = async () => {
  const res = await Props.searchProductList({ val: searchProduct.value, type: searchType.value })
  if (res.length > 0) {
    const index = readyAddproduct.value.findIndex(p => p.id === res[0].id)
    if (index !== -1)
      return
    productList.value.push(...res)
    setAddProduct(res[0])
  }
}
const confirm = () => {
  emits('addProduct', readyAddproduct.value)
  searchProduct.value = ''
  productList.value = []
  readyAddproduct.value = []
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
const realtype = (val?: number) => {
  switch (val) {
    case 1:
      return '计件'
    case 2:
      return '计重工费按克'
    case 3:
      return '计重工费按件'
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
        readyAddproduct = []
      }">
      <div class="grid-12 h-[300px] overflow-y-scroll">
        <div class="col-12">
          <div>
            <div class="flex justify-start py-[12px]">
              <div
                class="flex-center-col pr-[32px]">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'code' ? '#333' : '#53565C' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: searchType === 'code' ? '#2080F0' : '' }" />
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
                size="large"
                @focus="focus"
              />
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
          <div class="grid-12 color-[#333] font-semibold !text-[14px]">
            <div class="col-4">
              条码
            </div>
            <div class="col-3">
              名称
            </div>
            <div class="col-3">
              销售方式
            </div>
            <div class="col-2">
              金重
            </div>
          </div>
          <div class="py-[16px]">
            <template v-for="(item, index) in productList" :key="index">
              <div
                class="py-[12px] px-[8px] rounded-2xl grid-12 mb-[4px]"
                :style="{ color: readyAddproduct && readyAddproduct.findIndex(p => p.id === item.id) !== -1 ? '#2080F0' : '',
                          background: readyAddproduct && readyAddproduct.findIndex(p => p.id === item.id) !== -1 ? '#fff' : '' }"
                @click="setAddProduct(item)">
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.code }}
                </div>
                <div class="col-3 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.name }}
                </div>
                <div class="col-3 text-[12px] text-center">
                  {{ realtype(item.retail_type) }}
                </div>
                <div class="col-2">
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
