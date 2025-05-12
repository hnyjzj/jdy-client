<script lang="ts" setup>
import { calc } from 'a-calc'

const Props = defineProps<{
  isIntegral: boolean
}>()
const showPartsList = defineModel<ProductAccessories[]>('list', { default: [] })
const hold = defineModel<number>('hold', { default: 0 })
const hasCheck = ref(false)

// 应付金额失去焦点， 计算配件分数
const changeScore = (obj: ProductAccessories) => {
  if (!obj.amount) {
    obj.amount = 0
  }
  else {
    obj.integral = Props.isIntegral
      ? calc('(a / b)| =0 ~5, !n', {
          a: obj.amount,
          b: obj.rate,
        })
      : 0
  }
}
// 改变配件数量
const changeQuantity = (obj: ProductAccessories) => {
  if (obj.category.label_price) {
    // 计算应付金额
    obj.amount = calc('(a * b)| =0 ~5, !n', {
      a: obj.quantity || 1,
      b: Number(obj.category.label_price) || 0,
    })
  }

  if (obj.amount && obj.rate) {
  // 计算积分
    obj.integral = Props.isIntegral
      ? calc('(a / b)| =0 ~5, !n', {
          a: obj.amount,
          b: obj.rate,
        })
      : 0
  }
}
// 删除展示的配件
const confirmShow = ref(false)
const delId = ref(0)
const deleteParts = (index: number) => {
  confirmShow.value = true
  delId.value = index
}

const deleteConfirm = () => {
  showPartsList.value.splice(delId.value, 1)
  delId.value = 0
}
</script>

<template>
  <div class="px-[16px] py-[8px]">
    <template v-for="(obj, ix) in showPartsList" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" title="">
          <template #left>
            <common-tags type="pink" :text="obj?.category?.name" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[12px] px-[16px]">
              <common-cell label="编号" :value="obj?.id" />
              <common-cell label="名称" :value="obj?.category?.name" />
              <common-cell label="条码" :value="obj?.code" />
              <common-cell label="标价" :value="obj?.category?.label_price" />
              <common-cell label="重量" :value="obj?.category?.weight" />
              <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
              <div class="pb-[16px]">
                <n-grid :cols="24" :x-gap="8">
                  <n-form-item-gi :span="12" label="应付金额">
                    <n-input-number
                      v-model:value="obj.amount"
                      :show-button="false"
                      placeholder="请输入应付金额"
                      round
                      :precision="hold"
                      min="0"
                      @update:value="changeScore(obj)">
                      <template #suffix>
                        元
                      </template>
                    </n-input-number>
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="积分( + )">
                    <n-input-number
                      v-model:value="obj.integral"
                      :show-button="false"
                      :disabled="true"
                      min="0"
                      placeholder="请输入积分"
                      :default-value="Number(obj?.integral) || 0" round />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="数量">
                    <div class="flex items-center w-full">
                      <div class="w-full">
                        <n-input-number
                          v-model:value="obj.quantity" placeholder="请输入数量"
                          round
                          min="1"
                          :precision="0"
                          :show-button="false" @update:value="changeQuantity(obj)" />
                      </div>
                    </div>
                  </n-form-item-gi>
                </n-grid>
                <div class="flex justify-between items-center">
                  <div>
                    <div
                      class="p-[8px] col-2 flex-center-row cursor-pointer"
                      @click="deleteParts(ix)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </sale-order-nesting>
      </div>
    </template>
    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除此配件?"
      icon="error"
      @submit="deleteConfirm"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
