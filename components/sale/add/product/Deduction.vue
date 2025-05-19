<script lang="ts" setup>
const emits = defineEmits<{
  setScoreDeduct: [val: number]
  setAmountReduce: [val: number]
  setDiscountRate: [val: number]
}>()
// 设置整单积分抵扣
const scoreDeduct = ref<number>(0)

const amount_reduce = ref(0)

const discount_rate = ref<number>(100)
</script>

<template>
  <div>
    <div class="px-[16px]">
      <div class="flex justify-between">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi
            :span="12"
            label="整单折扣" label-placement="top"
          >
            <n-input-number
              v-model:value="discount_rate"
              placeholder="请输入折扣"
              round
              :precision="2"
              min="1"
              max="100"
              :show-button="false"
              @focus="focus"
              @update:value="emits('setDiscountRate', discount_rate)"
            >
              <template #suffix>
                %
              </template>
            </n-input-number>
          </n-form-item-gi>
          <!-- <n-form-item-gi
              :span="12"
              label="卡券抵扣" label-placement="top"
            >
              <n-input-number
                v-model:value="couponDeduct"
                placeholder="0"
                round
                min="0"
                :precision="2"
                :show-button="false"
                @blur="handleCouponReduceBlur"

              />
            </n-form-item-gi> -->
          <n-form-item-gi
            :span="12"
            label="积分抵扣" label-placement="top"
          >
            <n-input-number
              v-model:value="scoreDeduct"
              placeholder="0"
              round
              min="0"
              :precision="2"
              :show-button="false"
              @blur="emits('setScoreDeduct', scoreDeduct)"
              @focus="focus"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="12"
            label="抹零金额" label-placement="top"
          >
            <n-input-number
              v-model:value="amount_reduce"
              placeholder="0"
              round
              min="0"
              :precision="2"
              :show-button="false"
              @focus="focus"
              @blur="emits('setAmountReduce', amount_reduce)"

            />
          </n-form-item-gi>
        </n-grid>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
