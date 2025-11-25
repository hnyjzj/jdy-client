<script lang="ts" setup>
import { calc } from 'a-calc'

const props = defineProps<{
  rounding: string
  hold: number
}>()
const orderObject = defineModel<Orders>('list', { default: {} as Orders })
const hasCheck = ref(false)

// 删除展示的配件
const confirmShow = ref(false)
const delId = ref(0)
const deleteParts = (index: number) => {
  confirmShow.value = true
  delId.value = index
}
// 改变配件数量
const changeQuantity = (obj: OrderPart) => {
  if (obj.quantity && obj.one_price) {
    // 计算应付金额
    const qty = obj.quantity ?? 1
    const one_price = Number(obj.one_price ?? 0)
    obj.price = calc(`(a * b)| =${props.hold} ~${props.rounding}, !n`, {
      a: qty,
      b: one_price,
    })
  }
}
const changePrice = (obj: OrderPart) => {
  if (obj.price) {
    // 计算应付金额
    const price = Number(obj.price ?? 0)
    obj.price = calc(`(a) | =${props.hold} ~${props.rounding}, !n`, {
      a: price,
    })
  }
}

const deleteConfirm = () => {
  orderObject.value.showPartsList?.splice(delId.value, 1)
  delId.value = 0
}
</script>

<template>
  <div class="px-[16px] py-[8px]">
    <template v-for="(obj, ix) in orderObject.showPartsList" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" title="">
          <template #left>
            <common-tags type="pink" :text="obj?.name" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[12px] px-[16px]">
              <common-cell label="编号" :value="obj?.id" />
              <common-cell label="名称" :value="obj?.name" />
              <common-cell label="单价" :value="obj?.one_price" />
              <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
              <div class="pb-[16px]">
                <n-grid :cols="24" :x-gap="8">
                  <n-form-item-gi :span="12" label="数量">
                    <div class="flex items-center w-full">
                      <div class="w-full">
                        <n-input-number
                          v-model:value="obj.quantity"
                          placeholder="请输入数量" round
                          :min="1"
                          :precision="0"
                          :show-button="false"
                          @focus="focus"
                          @update:value="changeQuantity(obj)"
                        />
                      </div>
                    </div>
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="应付金额">
                    <div class="flex items-center w-full">
                      <div class="w-full">
                        <n-input-number
                          v-model:value="obj.price"
                          placeholder="请输入应付金额" round
                          :min="0"
                          :show-button="false"
                          @focus="focus"
                          @blur="changePrice(obj)"
                        />
                      </div>
                    </div>
                  </n-form-item-gi>
                </n-grid>
                <div class="flex justify-between items-center">
                  <div
                    class="p-[8px] col-2 flex-center-row cursor-pointer"
                    @click="deleteParts(ix)">
                    <icon name="i-svg:delete" :size="16" />
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
