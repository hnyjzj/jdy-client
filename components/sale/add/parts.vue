<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  price: string
  productList: Product[]
}>()
const emits = defineEmits<{
  search: [val: string, type: string]
  openProductList: []
}>()

const { $toast } = useNuxtApp()
const dialog = useDialog()
const showProductList = defineModel<OrderProducts[]>({ default: [] })
const showModal = ref(false)
const searchProduct = ref('')
const hasCheck = ref(false)
// 搜索商品 名称 和 条码   code
const searchType = ref('name')
// 添加商品
const addProduct = (product: Product) => {
  if (!product) {
    $toast.error('请选择商品')
    return
  }

  const index = showProductList.value.findIndex(item => item.product?.id === product.id)
  if (index !== -1 && showProductList.value[index].quantity) {
    // 判断是否已经添加过该商品,如果已经添加过,则数量加一
    // showProductList.value[index].quantity++
    $toast.error('该商品已经添加过')
    return
  }
  else if (
  // 如果没添加 并且数量为空,则数量为1
    index !== -1 && !showProductList.value[index].quantity
  ) {
    showProductList.value[index].quantity = 1
    return
  }
  const data = { quantity: 1, discount: undefined, amount: 0, product_id: product.id, product }
  showProductList.value.push(data)
  showModal.value = false
}
const readyAddproduct = ref()
const setAddProduct = (product: Product) => {
  readyAddproduct.value = product
}
// 计件方式
const count = (p: OrderProducts) => {
  if (!p.quantity)
    return
  // 如果是计件方式 标签价格x 数量 x 折扣
  if (p.product?.retail_type === 1) {
    const total = calc('(price * quantity * discount) | <=2,!n', {
      price: p.product?.price,
      quantity: p.quantity,
      discount: ((p.discount || 10) * 0.1),
    })
    p.amount = total
    return total
  }
  // 计重工费按克 [（金价 + 工费）X克重] X件数 X折扣
  if (p.product?.retail_type === 2) {
    const total = calc('(price + labor_fee) * weight_metal * quantity * discount | <=2,!n', {
      price: Props.price,
      labor_fee: p.product?.labor_fee,
      weight_metal: p.product?.weight_metal,
      quantity: p.quantity,
      discount: ((p.discount || 10) * 0.1),
    })
    p.amount = total
    return total
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (p.product?.retail_type === 3) {
    const total = calc('((price * weight_metal) + labor_fee) * quantity * discount | <=2,!n', {
      price: Props.price,
      labor_fee: p.product?.labor_fee,
      weight_metal: p.product?.weight_metal,
      quantity: p.quantity,
      discount: ((p.discount || 10) * 0.1),
    })
    p.amount = total
    return total
  }
}

// 删除商品
const deleteProduct = (index: number) => {
  dialog.error({
    title: '确定删除此商品吗?',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: () => {
      showProductList.value.splice(index, 1)
    },
  })
}
const changeType = (type: 'name' | 'code') => {
  searchType.value = type
  searchProduct.value = ''
  emits('openProductList')
}
const { useWxWork } = useWxworkStore()
// 扫码
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    showModal.value = true
    changeType('code')
    searchProduct.value = code
  }
}
</script>

<template>
  <common-fold title="配件信息" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12 gap-[20px]">
        <div
          class="btn-left col-span-4 offset-2 cursor-pointer" @click="() => {
            emits('openProductList')
            showModal = true
            searchProduct = ''
            readyAddproduct = null
          }">
          <icon name="i-icon:search" color="#fff" :size="12" />
          <div class="ml-2">
            搜索
          </div>
        </div>
        <div
          class="btn-right col-span-4 cursor-pointer" @click="scanCode()"
        >
          <icon name="i-icon:scanit" color="#1a6beb" :size="12" />
          <div class="ml-2">
            扫码
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
      <div class="px-[16px] py-[8px]">
        <template v-for="(obj, ix) in showProductList" :key="ix">
          <div class="pb-[12px]">
            <sale-order-nesting v-model="hasCheck" :title="obj.product?.name || ''">
              <template #left>
                <common-tags type="pink" text="成品" :is-oval="true" />
              </template>
              <template #info>
                <div class="flex flex-col gap-[12px] px-[16px]">
                  <div class="grid grid-flow-col w-full place-items-start gap-y-[12px] gap-x-[auto]">
                    <div class="flex-center-row gap-[8px]">
                      <div class="text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]">
                        条码
                      </div>
                      <div class="text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]">
                        {{ obj.product?.code }}
                      </div>
                    </div>
                  </div>
                  <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

                  <div class="pb-[16px]">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="12" label="折扣">
                        <n-input-number
                          v-model:value="obj.discount"
                          :show-button="false"
                          placeholder="请输入折扣"
                          round
                          min="1"
                          max="10"
                          :precision="2"
                        >
                          <template #suffix>
                            折
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="数量">
                        <div class="flex items-center justify-between">
                          <div class="w-full">
                            <n-input-number
                              v-model:value="obj.quantity"
                              placeholder="请输入折扣:单位(折)"
                              round
                              min="1"
                              :precision="0"
                              :show-button="false"
                              @blur="() => {
                                obj.quantity ? obj.quantity : obj.quantity = 1
                              }"
                            />
                          </div>
                          <div class="flex items-center justify-between">
                            <div
                              class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3] text-[26px]"
                              @click="() => {
                                obj.quantity ? obj.quantity++ : obj.quantity = 1
                              }">
                              +
                            </div>
                            <div
                              class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3]  text-[26px]"
                              @click="() => {
                                if (obj.quantity && obj.quantity > 1)
                                  obj.quantity ? obj.quantity-- : obj.quantity = 1
                              }">
                              <div class="w-[10px] h-[2px] bg-[#3971F3]" />
                            </div>
                          </div>
                        </div>
                      </n-form-item-gi>
                    </n-grid>
                    <div class="flex justify-between items-center">
                      <div>
                        <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteProduct(ix)">
                          <icon name="i-svg:delete" :size="16" />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="item-left">
                          应付金额：
                        </div>
                        <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                          ￥{{ count(obj) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </sale-order-nesting>
          </div>
        </template>
      </div>
    </template>

    <common-popup v-model:show="showModal" placement="bottom" title="搜商品" width="50%" @close="showModal = false">
      <div class="grid-12">
        <div class="col-12" uno-md="col-4 offset-4" uno-sm="col-8 offset-2">
          <div>
            <div class="flex justify-around py-[12px]">
              <div
                class="flex-center-col"
                @click="changeType('name')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'name' ? '#333' : '#53565C' }">
                  名称搜索
                </div>
                <div class="w-[32px] h-[4px] rounded " :style="{ background: searchType === 'name' ? '#2080F0' : '' }" />
              </div>
              <div
                class="flex-center-col"
                @click="changeType('code')">
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
                :placeholder="searchType === 'name' ? '请输入商品名称' : '请输入商品条码'" />
            </div>
            <div class="pl-[16px]">
              <n-button type="info" round @click="emits('search', searchProduct, searchType)">
                搜索
              </n-button>
            </div>
          </div>
          <div class="h-[150px] overflow-y-auto">
            <template v-for="(item, index) in Props.productList" :key="index">
              <div
                class="py-[8px] px-[8px] rounded-2xl flex justify-between items-center"
                :style="{ color: readyAddproduct && item.id === readyAddproduct.id ? '#2080F0' : '',
                          background: readyAddproduct && item.id === readyAddproduct.id ? '#fff' : '' }"
                @click="setAddProduct(item)">
                <div class="">
                  {{ item.name }} -- {{ item.code }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <template #footer>
        <common-button-bottom @confirm="addProduct(readyAddproduct)" @cancel="showModal = false" />
      </template>
    </common-popup>
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}

.activeBtn {
  --uno: 'bg-[#2080F0] color-[#fff]';
}
.defaultBtn {
  --uno: 'bg-[#F3F3F3] color-[#000]';
}
.n-input-number {
  width: 100%;
}
</style>
