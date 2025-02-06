<script setup lang="ts">
const Props = defineProps<{
  list: Product[]
  price: number
}>()

const hasCheck = defineModel({ type: Boolean, default: false })

const add = (obj: Product) => {
  if (obj.quantity || obj.quantity === 0) {
    obj.quantity++
  }
}
const minus = (obj: Product) => {
  if (obj.quantity && obj.quantity > 1) {
    obj.quantity--
  }
}
const changeQuantity = (evnet: any, obj: Product) => {
  const regex = /^[1-9]\d*$/
  if (regex.test(evnet.target?.value)) {
    obj.quantity = Number(evnet.target?.value)
  }
  else {
    obj.quantity = 1
  }
}

const handleBlur = (evnet: any, obj: Product) => {
  // 进一步简化，去掉所有未使用的捕获组
  const regex: RegExp = /^(?:10|\d(?:\.\d{1,2})?)$/

  if (regex.test(evnet.target?.value)) {
    // obj.quantity = Number(evnet.target?.value)
    obj.discount = Number(evnet.target?.value)
  }
  else {
    obj.discount = undefined
  }
}
// 计件方式
const type1 = (product: Product) => {
  if (!product.quantity)
    return
  // 如果是计件方式
  if (product.retail_type === 1) {
    const total = product.payable_amount = product.price * Number(product.quantity) * (product.discount || 10)
    return total.toFixed(2)
  }
  // 计重工费按克 [（金价 + 工费）X克重] X件数 X折扣
  if (product.retail_type === 2) {
    const total = ((Props.price + product.labor_fee) * product.weight_metal) * Number(product.quantity) * (product.discount || 10)
    return total.toFixed(2)
  }
  //   计重工费按件   （(金价X克重)) + 工费）X件数 X折扣
  if (product.retail_type === 3) {
    const total = ((Props.price * product.weight_metal) + product.labor_fee) * Number(product.quantity) * (product.discount || 10)
    return total.toFixed(2)
  }
}
</script>

<template>
  <div>
    <template v-for="(obj, ix) in Props.list" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" :title="obj.name">
          <template #right>
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
                  <div class="item">
                    <div class="item-left">
                      折扣
                    </div>
                    <div class="w-[90px] py-[6px] px-[12px] border-[#e6e6e8] border border-solid rounded-3xl">
                      <input v-model="obj.discount" type="number" class="w-full border-none" @blur="handleBlur($event, obj)">
                    </div>
                    <div class="item-left">
                      折
                    </div>
                  </div>
                  <div class="item flex-1">
                    <div class="item-left">
                      数量
                    </div>
                    <div class=" max-w-[120px] flex py-[6px] px-[6px] border-[#e6e6e8] border border-solid rounded-3xl">
                      <input v-model="obj.quantity" type="number" class="w-full border-none" @blur="changeQuantity($event, obj)">
                      <common-count-add @click="add(obj)" />
                      <common-count-minus @click="minus(obj)" />
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    应付金额
                  </div>
                  <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                    {{ type1(obj) }}
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
