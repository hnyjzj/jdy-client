<script setup lang="ts">
// 维修单列表
const props = defineProps<{
  list: ServiceOrderInfo[]
  where: Where<service>
  getList: () => Promise<void>
  cancelOrder: (id: string) => Promise<boolean>
  payOrder: (id: string) => Promise<boolean>
}>()

// 查看详情
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/service/info?id=${id}`)
}
const revokeDialog = ref(false)
const readyRevokId = ref<string>()
const { $toast } = useNuxtApp()
const revoke = async () => {
  const res = await props.cancelOrder(readyRevokId.value!)
  if (res) {
    $toast.success('撤销订单成功')
    await props.getList()
  }
  else {
    $toast.error('撤销订单失败')
  }
}

const handleCancel = (id: string) => {
  if (!id) {
    return
  }
  readyRevokId.value = id
  revokeDialog.value = true
}
const paydialog = ref(false)
const payid = ref<string>()
const pay = async () => {
  const res = await props.payOrder(payid.value!)
  if (res) {
    $toast.success('支付订单成功')
    await props.getList()
  }
  else {
    $toast.error('支付订单失败')
  }
}
const handlePay = (id: string) => {
  if (!id) {
    return
  }
  payid.value = id
  paydialog.value = true
}
</script>

<template>
  <div class="grid grid-cols-1 gap-[16px] " uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.list" :key="index">
      <sale-cards :title="`单号:${item.id}`" :tag-text="props.where.status?.preset[item.status]">
        <template #info>
          <div class="info">
            <common-cell label="所属门店" :value="item.store?.name" />
            <common-cell :label="item.member?.nickname!" :value="item.member?.phone" />
            <common-cell label="维修项目" :value="item.name" />
            <common-cell label="货品名称" :value="item.name" />
            <common-cell label="维修费" :value="item.expense" />
            <common-cell label="取货方式" :value="item.delivery_method === 1 ? '自提' : '邮寄'" />
            <common-cell label="创建时间" :value="formatISODate(item.created_at as string)" />
            <common-cell label="更新时间" :value="formatISODate(item.updated_at as string)" />
          </div>
        </template>
        <template #footer>
          <div class="flex-between bg-[#F3F5FE] rounded-b-[24px] dark:bg-[rgba(243,245,254,0.1)]">
            <div class="color-[#4287F4] cursor-pointer flex justify-center items-center">
              <template v-if="OrderStatusText.OrderSalesProductStatusWaitPay === item.status">
                <div class="pl-[20px]" @click="handleCancel(item.id)">
                  撤销
                </div>
                <div class="pl-[20px]" @click="handlePay(item.id)">
                  支付
                </div>
              </template>
            </div>
            <common-button-irregular text="查看详情" @click="handleClick(item.id)" />
          </div>
        </template>
      </sale-cards>
    </template>

    <common-confirm v-model:show="revokeDialog" icon="error" title="撤销提醒" text="确认要撤销此订单吗?" @submit="revoke" />
    <common-confirm v-model:show="paydialog" icon="success" title="支付确认" text="确认支付了此订单吗?" @submit="pay" />
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px] px-[16px]';

  .part {
    --uno: 'flex-center-between';
    &-left {
      --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
    }
    &-right {
      --uno: 'text-size-[14px] color-[#333] dark:color-[#fff]';
    }
  }
}
</style>
