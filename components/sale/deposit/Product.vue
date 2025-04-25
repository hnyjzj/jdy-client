<script lang="ts" setup>
const props = defineProps<{
  productList: ProductFinisheds[]
}>()
const emit = defineEmits<{
  search: [val: string]
}>()
const { $toast } = useNuxtApp()
const showModal = ref(false)
// 条码搜索框
const searchInput = ref('')
const showProductList = defineModel<DepositOrderProduct[]>({ default: [] })
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
const searchProduct = () => {
  emit('search', searchInput.value)
}

// 选择成品
const readyAddproduct = ref()
const setAddProduct = (product: ProductFinisheds) => {
  readyAddproduct.value = product
}

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
const hasCheck = ref(false)
// 删除商品
const deleteProduct = (index: number) => {
  showProductList.value.splice(index, 1)
//   dialog.error({
//     title: '确定删除此商品吗?',
//     negativeText: '取消',
//     positiveText: '确定',
//     onPositiveClick: () => {
//       showProductList.value.splice(index, 1)
//     },
//   })
}
const handleFormRef = ref()
const handleAddProductPopup = ref(false)

const handleFormData = ref({
  name: '',
  label_price: 0,
  weight_metal: 0,
  labor_fee: 0,
  retail_type: 1,
  weight_gem: 0,
  color_gem: 1,
  clarity: 1,
})
const handleFormRules = {}
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
          <template v-for="(obj, ix) in showProductList" :key="ix">
            <div class="pb-[12px]">
              <sale-order-nesting v-model="hasCheck" :title="obj.product?.name || ''">
                <template #left>
                  <common-tags type="pink" text="成品" :is-oval="true" />
                </template>
                <template #info>
                  <div class="flex flex-col gap-[4px] px-[16px]">
                    <common-cell label="名称" :value="obj.product?.name" />
                    <common-cell label="条码" :value="obj.product?.code" />
                    <common-cell label="零售方式" :value="realtype(obj.product?.retail_type)" />
                    <common-cell label="金重" :value="`${obj.product?.weight_metal}g`" />
                    <common-cell label="工费" :value="`${obj.product?.labor_fee}`" />
                    <common-cell label="主石重(ct)" :value="obj.product?.weight_gem" />
                    <common-cell label="颜色" :value="obj.product?.color_gem" />
                    <common-cell label="净度" :value="obj.product?.clarity" />
                    <common-cell label="标签价" :value="obj.product?.label_price" val-color="#2472EE" />
                    <div class="py-[8px]">
                      <div class="h-[1px]  bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                    </div>
                    <div class="pb-[16px]">
                      <n-grid :cols="24" :x-gap="8">
                        <n-form-item-gi :span="12" label="金价(元/g)">
                          <n-input-number
                            v-model:value="obj.price_gold"
                            :show-button="false"
                            placeholder="请输入金价(元/g)"
                            round

                            @blur="() => {
                              if (!obj.price_gold?.toString()){
                                obj.price_gold = 0
                              }
                            }"
                          />
                        </n-form-item-gi>

                        <n-form-item-gi :span="12" label="订金金额">
                          <n-input-number
                            v-model:value="obj.price"
                            :show-button="false"
                            placeholder="请输入订金金额"
                            round
                            min="0"
                          />
                        </n-form-item-gi>
                      </n-grid>
                      <div class="flex justify-between items-center">
                        <div>
                          <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteProduct(ix)">
                            <icon name="i-svg:delete" :size="16" />
                          </div>
                        </div>
                        <div class="flex" />
                      </div>
                    </div>
                  </div>
                </template>
              </sale-order-nesting>
            </div>
          </template>
        </div>
      </div>
    </common-fold>
    <common-model v-model="showModal" title="选择成品" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="showModal = false">
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
                placeholder="请输入商品条码" />
            </div>
            <div class="pl-[16px]">
              <n-button type="info" round @click="searchProduct">
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
            <template v-for="(item, index) in props.productList" :key="index">
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
            <template v-if="props.productList.length === 0">
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </common-model>
    <common-model v-model="handleAddProductPopup" title="手动添加" :show-ok="true" :show-cancel="true" @confirm="addProduct(readyAddproduct)" @cancel="showModal = false">
      <n-form
        ref="handleFormRef"
        :model="handleFormData"
        :rules="handleFormRules"
        label-placement="top"
      >
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi :span="12" label="货品名称" path="name">
            <n-input v-model:value="handleFormData.name" placeholder="货品名称" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="标签价">
            <n-input-number v-model:value="handleFormData.label_price" placeholder="标签价" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="工费">
            <n-input-number v-model:value="handleFormData.labor_fee" placeholder="工费" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="金重">
            <n-input-number v-model:value="handleFormData.weight_metal" placeholder="金重" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="主石重">
            <n-input-number v-model:value="handleFormData.weight_gem" placeholder="主石重" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="零售方式">
            <n-select
              v-model:value="handleFormData.retail_type"
              placeholder="零售方式"
              :options="[{ label: '计件', value: 1 }, { label: '计重工费按克', value: 2 }, { label: '计重工费按件', value: 3 }]" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="颜色">
            <n-select
              v-model:value="handleFormData.color_gem"
              placeholder="颜色"
              :options="[{ label: '计件', value: 1 }, { label: '计重工费按克', value: 2 }, { label: '计重工费按件', value: 3 }]" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="净度">
            <n-select
              v-model:value="handleFormData.clarity"
              placeholder="净度"
              :options="[{ label: '计件', value: 1 }, { label: '计重工费按克', value: 2 }, { label: '计重工费按件', value: 3 }]" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </common-model>
    <common-confirm />
  </div>
</template>

<style lang="scss" scoped>

</style>
