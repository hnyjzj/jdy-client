<script setup lang="ts">
import { calc } from 'a-calc'

const Props = defineProps<{
  price: number
}>()

const dialog = useDialog()
const showProductList = defineModel<OrderProduct[]>({ default: [] })
const hasCheck = ref(false)
// 计件方式
const count = (product: OrderProduct) => {
  if (!product.quantity)
    return
  // 如果是计件方式 标签价格x 数量 x 折扣
  if (product.retail_type === 1) {
    const total = calc('(price * quantity * discount) | <=2,!n', {
      price: product.price,
      quantity: product.quantity,
      discount: ((product.discount || 10) * 0.1),
    })
    product.payable_amount = total
    return total
  }
  // 计重工费按克 [（金价 + 工费）X克重] X件数 X折扣
  if (product.retail_type === 2) {
    const total = calc('(price + labor_fee) * weight_metal * quantity * discount | <=2,!n', {
      price: Props.price,
      labor_fee: product.labor_fee,
      weight_metal: product.weight_metal,
      quantity: product.quantity,
      discount: ((product.discount || 10) * 0.1),
    })
    product.payable_amount = total
    return total
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (product.retail_type === 3) {
    const total = calc('((price * weight_metal) + labor_fee) * quantity * discount | <=2,!n', {
      price: Props.price,
      labor_fee: product.labor_fee,
      weight_metal: product.weight_metal,
      quantity: product.quantity,
      discount: ((product.discount || 10) * 0.1),
    })
    product.payable_amount = total
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
</script>

<template>
  <div>
    <template v-for="(obj, ix) in showProductList" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" :title="obj.name">
          <template #left>
            <common-tags type="pink" text="成品" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[12px] px-[16px]">
              <div class="grid grid-flow-col w-full place-items-start gap-y-[12px] gap-x-[auto]">
                <div class="content">
                  <div class="left">
                    条码
                  </div>
                  <div class="right">
                    {{ obj.code }}
                  </div>
                </div>
              </div>
              <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

              <div class="footer">
                <div class="flex justify-between items-center pb-[12px]">
                  <n-form-item label="折扣" class="w-[49%]">
                    <n-input-number
                      v-model:value="obj.discount"
                      :show-button="false"
                      placeholder="请输入折扣"
                      round
                      min="1"
                      max="10"
                      :precision="2"
                      type="text"
                    >
                      <template #suffix>
                        折
                      </template>
                    </n-input-number>
                  </n-form-item>
                  <n-form-item label="数量" class="w-[49%]">
                    <n-input-number
                      v-model:value="obj.quantity"
                      placeholder="请输入折扣:单位(折)"
                      round
                      min="1"
                      type="text"
                    />
                  </n-form-item>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteProduct(ix)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                  <div class="flex">
                    <div class="item-left">
                      应付金额
                    </div>
                    <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                      {{ count(obj) }}
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

<style scoped lang="scss">
.content {
  --uno: 'flex-center-row gap-[8px]';

  .left {
    --uno: 'text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'text-[14px] font-medium text-[#333333] dark:color-[#FFFFFF]';
  }
}

.footer {
  --uno: 'pb-[16px]';

  .item {
    --uno: 'flex-end gap-[8px]';

    &-left {
      --uno: 'color-[#666] font-size-[14px] font-medium dark:color-[#CBCDD1]';
    }

    &-right {
      --uno: 'bg-[#F5F5F5] color-[#000] font-size-[14px] font-medium rounded-[24px] border-solid border-1 border-[#E6E6E8] px-[12px] py-[2px] dark:color-[#666666] dark:bg-[rgb(245,245,245,0.5)] dark:border-[rgb(245,245,245,0.5)]';
    }
  }
}
</style>
