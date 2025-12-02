<script lang="ts" setup>
// 订金单搜索选择成品组件

const emit = defineEmits<{
  add: [product: ProductFinisheds[]]
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

const { $toast } = useNuxtApp()
const showModal = ref(false)
// 选择成品
const readyAddproduct = ref<ProductFinisheds[]>([])
const setAddProduct = (product: ProductFinisheds) => {
  const index = readyAddproduct.value.findIndex(p => p.id === product.id) // 假设每个产品都有一个唯一的 id 属性
  index !== -1
    ? readyAddproduct.value.splice(index, 1)
    : readyAddproduct.value.push(product)
}
// 条码搜索框
const inputRef = ref()
const searchInput = ref('')
const searchList = ref<ProductFinisheds[]>([])
const searchProduct = async () => {
  if (!searchInput.value) {
    $toast.error('请输入搜索内容')
    return
  }
  const res = await searchProductList({ val: searchInput.value })
  if (res.length > 0) {
    const index = readyAddproduct.value.findIndex(p => p.id === res[0].id)
    if (index !== -1)
      return
    searchList.value.push(...res)
    setAddProduct(res[0])
    searchInput.value = ''
    inputRef.value?.focus()
  }
}
const addProduct = (product: ProductFinisheds[]) => {
  emit('add', product)

  showModal.value = false
  searchInput.value = ''
  inputRef.value?.focus()
}
const { useWxWork } = useWxworkStore()
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    searchInput.value = code
    searchProduct()
  }
}
const openSearch = () => {
  readyAddproduct.value = []
  searchList.value = []
  showModal.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}
</script>

<template>
  <div class="col-6 cursor-pointer" uno-sm="col-4 offset-2">
    <div
      class="flex btn-left" @click="openSearch"
    >
      <icon name="i-icon:search" color="#fff" :size="16" />
      <div class="ml-2">
        搜索
      </div>
    </div>
    <common-model
      v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="() => {
        showModal = false
        searchInput = ''
      }">
      <div class="grid-12 h-[300px] overflow-y-scroll">
        <div class="col-12">
          <div>
            <div class="flex  py-[12px]">
              <div
                class="flex-center-col">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: '#333' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: '#2080F0' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                ref="inputRef"
                v-model:value="searchInput"
                size="large"
                type="text"
                clearable
                placeholder="请输入商品条码"
                @keydown.enter="searchProduct"
                @focus="focus" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="searchProduct">
                搜索
              </n-button>
              <div class="pl-[8px]">
                <n-button strong secondary type="info" round @click="scanCode()">
                  扫码
                </n-button>
              </div>
            </div>
          </div>
          <div class="grid-12 px-[12px] color-[#333] font-semibold !text-[14px]">
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
          <div class=" py-[16px]">
            <template v-for="(item, index) in searchList" :key="index">
              <div
                class="py-[12px] px-[8px] rounded-2xl grid-12 mb-[8px]"
                :style="{ color: readyAddproduct && readyAddproduct.findIndex(p => p.id === item.id) !== -1 ? '#2080F0' : '',
                          background: readyAddproduct && readyAddproduct.findIndex(p => p.id === item.id) !== -1 ? '#fff' : '' }"
                @click="setAddProduct(item)">
                <div class="col-4 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.code }}
                </div>
                <div class="col-3 whitespace-nowrap text-ellipsis overflow-hidden">
                  {{ item.name }}
                </div>
                <div class="col-3">
                  {{ realtype(item.retail_type) }}
                </div>
                <div class="col-2">
                  {{ item.weight_metal }}
                </div>
              </div>
            </template>
            <template v-if="searchList.length === 0">
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
.btn-right {
  --uno: 'text-[16px] py-[9px]  text-[#1a6beb]  dark:color-#fff dark:border-[#fff] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}
</style>
