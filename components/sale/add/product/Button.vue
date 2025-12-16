<script lang="ts" setup>
const emits = defineEmits<{
  addProduct: [val: ProductFinisheds[]]
  search: []
}>()
const { getFinishedList } = useFinished()
// 搜索成品,查询list
const searchProductList = async (data: { val: string }) => {
  if (data.val) {
    const res = await getFinishedList({ page: 1, limit: 10, where: { code: data.val, status: ProductFinishedsStatus.Normal } })
    return res?.data.list || []
  }
  return []
}

const showModal = ref(false)
// 搜索出来的货品列表
const productList = ref<ProductFinisheds[]>([])

//  已选的成品列表(点击确定时,此列表会传给父组件用作,添加到成品展示数组showProductList)
const readyAddproduct = ref([] as ProductFinisheds[])
const setAddProduct = (product: ProductFinisheds) => {
  const index = readyAddproduct.value.findIndex(p => p.id === product.id) // 假设每个产品都有一个唯一的 id 属性
  index !== -1
    ? readyAddproduct.value.splice(index, 1)
    : readyAddproduct.value.push(product)
}

// 输入框
const inputRef = ref()

const searchProduct = ref('')
const search = async () => {
  const res = await searchProductList({ val: searchProduct.value })
  if (res.length > 0) {
    const index = readyAddproduct.value.findIndex(p => p.id === res[0].id)
    if (index !== -1)
      return
    productList.value.push(...res)
    setAddProduct(res[0])
    searchProduct.value = ''
    inputRef.value?.focus()
  }
}
const clearData = () => {
  showModal.value = false
  searchProduct.value = ''
  productList.value = []
  readyAddproduct.value = []
}
const confirm = () => {
  emits('addProduct', readyAddproduct.value)
  clearData()
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
const openSearch = () => {
  showModal.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}
</script>

<template>
  <div class="p-[16px]">
    <div class="btn grid-12 gap-[8px]">
      <div
        class="btn-left col-6 offset-3 cursor-pointer" uno-sm="col-4 offset-4" @click="openSearch">
        <icon name="i-icon:search" color="#fff" :size="16" />
        <div class="ml-2">
          搜索
        </div>
      </div>
    </div>
    <common-model
      v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="confirm" @cancel="clearData()">
      <div class="grid-12 h-[400px] overflow-y-auto">
        <div class="col-12">
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                ref="inputRef"
                v-model:value="searchProduct"
                type="text"
                clearable
                placeholder="请输入商品条码"
                size="large"
                @keydown.enter="search"
                @focus="focus"
              />
            </div>
            <div class="pl-[16px] flex gap-[8px]">
              <common-button-rounded content="搜索" @click="search()" />
              <template v-if="checkEnv()">
                <common-button-rounded content="扫码" bgc="#f1f5fe" color="#1a6dd8" @click="scanCode()" />
              </template>
            </div>
          </div>
          <div class="grid-12 text-color font-semibold !text-[14px]">
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
              <common-empty text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center py-[10px]';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
</style>
