<script lang="ts" setup>
// 订金单搜索选择成品组件
const props = defineProps<{
  searchProductList: (str: string) => Promise< ProductFinisheds[]>
}>()
const emit = defineEmits<{
  add: [product: ProductFinisheds]
}>()
const showModal = defineModel<boolean>('show', { default: false })
// 选择成品
const readyAddproduct = ref()
const setAddProduct = (product: ProductFinisheds) => {
  readyAddproduct.value = product
}
// 条码搜索框
const searchInput = ref('')
const searchList = ref<ProductFinisheds[]>([])
const searchProduct = async () => {
  searchList.value = await props.searchProductList(searchInput.value)
}
const addProduct = (product: ProductFinisheds) => {
  emit('add', product)
  showModal.value = false
  searchInput.value = ''
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
</script>

<template>
  <div>
    <common-model
      v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="() => {
        showModal = false
        searchInput = ''
      }">
      <div class="grid-12">
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
                v-model:value="searchInput"
                type="text"
                clearable
                placeholder="请输入商品条码"
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
            <template v-for="(item, index) in searchList" :key="index">
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
            <template v-if="searchList.length === 0">
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
