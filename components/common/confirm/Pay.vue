<script lang="ts" setup>
const emits = defineEmits<{
  pay: []
  cancle: []
}>()
const cancelDialog = ref(false)
const payDialog = ref(false)
</script>

<template>
  <div class="grid-12 gap-[12px] mt-[12px]">
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <sale-cards title="支付确认">
        <template #info>
          <div class="flex justify-around">
            <div
              class="pl-[8px] flex OrderDetails-center text-[16px] mr-[16px] color-[#3971F3] cursor-pointer" @click="() => {
                payDialog = true
              }">
              <icon name="i-svg:confirmpay" :size="16" class="mr-[4px]" />
              <span>
                支付
              </span>
            </div>
            <div
              class="flex OrderDetails-center text-[16px] mr-[16px] color-[rgba(255,47,47,1)] cursor-pointer" @click="() => {
                cancelDialog = true
              }">
              <icon name="i-svg:cancelpay" :size="16" class="mr-[4px]" />
              撤销
            </div>
          </div>
        </template>
      </sale-cards>
    </div>
  </div>
  <common-confirm
    v-model:show="cancelDialog" icon="error" title="撤销提醒" text="确认要撤销此订单吗?" @submit="() => {
      emits('cancle')
    }" />
  <common-confirm
    v-model:show="payDialog" icon="success" title="支付确认" text="确认支付了此订单吗?" @submit="() => {
      emits('pay')
    }" />
</template>

<style lang="scss" scoped>

</style>
