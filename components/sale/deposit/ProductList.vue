<script lang="ts" setup>
// 订金单列表组件
const props = defineProps<{
  filterList: Where<ProductFinisheds>
}>()
const showProductList = defineModel<DepositOrderProduct[]>('list', { default: [] })

const hasCheck = ref(false)
// 删除商品
const deleteProduct = (index: number) => {
  showProductList.value.splice(index, 1)
}
</script>

<template>
  <div>
    <template v-for="(obj, ix) in showProductList" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" :title="obj.product?.name || ''">
          <template #left>
            <common-tags type="pink" text="成品" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[4px] px-[16px]">
              <template v-if="obj.is_our === true">
                <common-cell label="名称" :value="obj.product?.name " />
                <common-cell label="条码" :value="obj.product?.code " />
                <common-cell label="零售方式" :value="realtype(obj.product?.retail_type) " />
                <common-cell label="金重" :value="`${obj.product?.weight_metal || '0'}g` " />
                <common-cell label="工费" :value="`${obj.product?.labor_fee}`" />
                <common-cell label="主石重(ct)" :value="obj.product?.weight_gem " />
                <common-cell label="主石颜色" :value="props.filterList.color_gem?.preset[(obj.product?.color_gem as number)] " />
                <common-cell label="主石净度" :value="props.filterList.clarity?.preset[(obj.product?.clarity as number)] " />
                <common-cell label="标签价" :value="obj.product?.label_price " val-color="#2472EE" />
              </template>
              <template v-if="obj.is_our === false">
                <common-cell label="名称" :value="obj?.name " />
                <common-cell label="标签价" :value="obj?.label_price " />
                <common-cell label="金重" :value="obj?.weight_metal " />
                <common-cell label="工费" :value="obj?.labor_fee " />
                <common-cell label="零售方式" :value="realtype(obj?.retail_type) " />
                <common-cell label="主石重(ct)" :value="obj?.weight_gem " />
                <common-cell label="主石颜色" :value="props.filterList.clarity?.preset[(obj?.color_gem as number)] " />
                <common-cell label="主石净度" :value="props.filterList.clarity?.preset[(obj?.clarity_gem as number)] " />
              </template>
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
                      @focus="focus"
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
                      @focus="focus"
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
</template>

<style lang="scss" scoped>

</style>
