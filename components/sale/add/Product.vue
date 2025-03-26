<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  price: GoldPrices[]
  productList: Product[]
  type: number
}>()
const emits = defineEmits<{
  search: [val: string, type: string]
  openProductList: []
}>()
const cardTitle = () => {
  switch (Props.type) {
    case 1:
      return '成品信息'
    case 2:
      return '旧料信息'
    case 3:
      return '配件信息'
  }
}

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

  const index = showProductList.value?.findIndex(item => item?.product_id === product.id)
  if (index === -1) {
    const data = { price: 0, quantity: 1, discount: undefined, amount: 0, product_id: product.id, labor_fee: Number(product.labor_fee), product }
    // 判断是否为  成品
    const filtered = Props.price.filter(item => item.product_type === 1)
    const exists = filtered.some(item =>
      item.product_type === 1
      && item.product_material === product.material
      && item.product_quality.includes(product.quality)
      && item.product_brand?.includes(product.brand),
    )
    if (exists) {
      console.log('c')
    }
    else {
      data.price = 0
    }
    // data.labor_fee = product.labor_fee
    showProductList.value.push(data)
  }
  else {
    $toast.error('该商品已经添加过')
    return
  }

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
    const total = calc('(price * discount) | <=2,!n', {
      price: p.product.price,
      discount: ((p.discount || 10) * 0.1),
    })
    p.amount = total
    return total
  }

  // 计重工费按克 [（金价 + 工费）X克重] X折扣
  if (p.product?.retail_type === 2) {
    const total = calc('(price + labor_fee) * weight_metal * discount | <=2,!n', {
      price: p.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product?.weight_metal,
      discount: ((p.discount || 10) * 0.1),
    })
    p.amount = total
    return total
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (p.product?.retail_type === 3) {
    const total = calc('((price * weight_metal) + labor_fee)  * discount | <=2,!n', {
      price: p.price,
      labor_fee: p?.labor_fee,
      weight_metal: p.product?.weight_metal,
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
const realtype = (val?: number) => {
  switch (val) {
    case 1:
      return '一口价'
    case 2:
      return '计重工费按克'
    case 3:
      return '计重工费按件'
  }
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
  <common-fold :title="cardTitle()" :is-collapse="false">
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
                  <common-cell label="名称" :value="obj.product?.name" />
                  <common-cell label="条码" :value="obj.product?.code" />
                  <common-cell label="金重" :value="obj.product?.weight_metal" />
                  <common-cell label="零售方式" :value="realtype(obj.product?.retail_type)" />
                  <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

                  <div class="pb-[16px]">
                    <n-grid :cols="24" :x-gap="8">
                      <template v-if="obj.product?.retail_type !== 1">
                        <n-form-item-gi :span="12" label="金价(元/g)">
                          <n-input-number
                            v-model:value="obj.price"
                            :show-button="false"
                            placeholder="请输入金价(元/g)"
                            round
                            min="0"
                            :precision="2"
                          />
                        </n-form-item-gi>
                      </template>

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
                      <template v-if="obj.product?.retail_type !== 1">
                        <n-form-item-gi :span="12" label="工费">
                          <n-input-number
                            v-model:value="obj.labor_fee"
                            :show-button="false"
                            placeholder="请输入工费"
                            :default-value="Number(obj.product?.labor_fee)"
                            round
                            min="0"
                            :precision="2"
                          />
                        </n-form-item-gi>
                      </template>
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
    <common-model v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="showModal = false">
      <div class="grid-12">
        <div class="col-12">
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
            <template v-for="(item, index) in Props.productList" :key="index">
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
                  {{ realtype(item.retail_type) }}
                </div>
                <div class="col-1">
                  {{ item.weight_metal }}
                </div>
              </div>
            </template>
            <template v-if="Props.productList.length === 0">
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
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
