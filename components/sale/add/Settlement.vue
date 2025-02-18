<script lang="ts" setup>
import { calc } from 'a-calc'

const formData = defineModel<Orders>('form', { default: {} })
const showProductList = defineModel<OrderProducts[]>('showList', { default: [] })
// 计算应付金额
const payMoney = computed(() => {
  const total = ref(0)
  total.value = showProductList.value.reduce((total, item) => {
    return calc('(t + i) | <=2,!n', { t: total, i: item.amount })
  }, 0)
  total.value = calc('(t * r) | <=2,!n', { t: total.value, r: ((formData.value.discount_rate || 10) * 0.1) })
  return total.value
})
</script>

<template>
  <common-fold title="结算信息" :is-collapse="false">
    <div class="p-[16px]">
      <div>
        <div class="flex justify-between">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi
              :span="12"
              label="整单折扣" label-placement="top"
              size="large"
            >
              <n-input-number
                v-model:value="formData.discount_rate"
                placeholder="请输入折扣"
                round
                :precision="2"
                min="1"
                max="10"
                type="text"
              />
            </n-form-item-gi>

            <n-form-item-gi
              :span="12"
              label="抹零金额" label-placement="top"
              size="large"
            >
              <n-input-number
                v-model:value="formData.amount_reduce"
                placeholder="0"
                round
                min="0"
                type="text"
              />
            </n-form-item-gi>
          </n-grid>
        </div>
        <div class="border-y-[#E6E6E8] border border-y-solid py-[12px]">
          <div class="text-[16px] color-[#3971F3] line-height-[24px] pb-[10px] text-right font-semibold">
            实付金额:{{ payMoney }}
          </div>
        </div>
        <n-form-item
          label="备注信息"
        >
          <n-input
            v-model:value="formData.remark"
            :style="{ '--n-border-radius': '20px' }"
            placeholder="备注信息"
            type="textarea"
          />
        </n-form-item>
      </div>
    </div>
  </common-fold>
</template>

<style>
.n-input-number {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.refer {
  --uno: 'flex flex-between min-w-[80px] gap-[4px] px-[12px] py-[6px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}

.remark {
  --uno: 'w-auto border-[#E6E6E8] border border-solid rounded-[8px] px-[4px] pt-[4px] pb-[32px] bg-[#fff] tracking-[1px] text-[14px] dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.3)] color-[#333] dark:color-[#fff] resize-y';
}

textarea::placeholder {
  --uno: 'color-[#cbcdd1]';
}

.operation-enter-active,
.operation-leave-active {
  --uno: 'transition-all ease-in-out duration-500';
}
.operation-enter-from,
.operation-leave-to {
  --uno: 'translate-x-[30px] opacity-0';
}

textarea:focus {
  --uno: 'border border-solid border-[1px] border-[#3971f3] outline-[none]';
}
</style>
