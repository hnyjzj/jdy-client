<script setup lang="ts">
// 销售单列表
const props = defineProps<{
  info: DepositOrderInfo[]
  where: Where<DepositOrderWhere>
  isStoreStaff: () => Promise<boolean>
}>()

const { initObjForm } = useOrder()
const { $toast } = useNuxtApp()
const handleClick = (id?: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/deposit/order?id=${id}`)
}

const openOrder = async (id?: string) => {
  if (!id) {
    return
  }
  const res = await props.isStoreStaff()
  if (!res) {
    $toast.error('未入职门店无法操作')
    return
  }
  initObjForm()
  navigateTo(`/sale/sales/add?id=${id}`)
}
const jumpSaleOreder = (id: string) => {
  if (!id) {
    return
  }
  navigateTo(`/sale/sales/order?id=${id}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-x-[16px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
    <template v-for="(item, index) in props.info" :key="index">
      <common-card-list :title="`订金单:${item.id}`" :status-map="DepositOrderStatusColor" :status="item.status" :tag-text="props.where.status?.preset[item.status!]">
        <template #info>
          <div class="info">
            <common-cell label="门店" :value="item.store?.name || '--'" />
            <common-cell label="会员" :value="item.member?.name || '--'" />
            <common-cell label="会员手机" :value="item.member?.phone || '--'" />
            <common-cell label="主销" :value="item.clerk?.nickname || '--'" />
            <common-cell label="定金金额" :value="item.price || '--'" />
            <div class="line-color-b" />
            <common-cell label="货品" value="" />
            <template v-for="(ele, i) in item.products" :key="i">
              <template v-if="ele.is_our">
                <common-cell :label="ele.product_finished?.name || '--'" :value="ele.product_finished?.code || '--'" label-color="#2B77EF" />
              </template>
              <template v-else>
                <common-cell :label="ele.product_demand?.name || '--'" :value="ele.product_demand?.code || '--'" label-color="#2B77EF" />
              </template>
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <div class="color-[#4287F4] cursor-pointer flex justify-center items-center">
              <template v-if="item.status === DepositOrderStatus.Booking">
                <div class="pl-[8px] " @click="openOrder(item.id)">
                  开单
                </div>
              </template>
              <template v-if="item.order_sales.length">
                <div class="pl-[8px] " @click="jumpSaleOreder(item.order_sales[0].id)">
                  销售单
                </div>
              </template>
            </div>
            <div class="flex-end">
              <common-button-rounded padding="4px 36px" content="详情" @button-click="handleClick(item.id)" />
            </div>
          </div>
        </template>
      </common-card-list>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .info {
  --uno: 'flex flex-col gap-[3px]';

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
