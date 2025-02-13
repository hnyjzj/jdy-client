<script lang="ts" setup>
const props = defineProps<{
  orders: Orders
}>()
const isMain = (val?: boolean) => {
  return val ? '是' : '否'
}
</script>

<template>
  <div class="grid-12 gap-[12px]">
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
      <sale-cards title="基本信息">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <common-cell label="订单编号" :value="props.orders.id" />
              <common-cell label="订单类型" :value="showType(props.orders.type)" />
              <common-cell label="订单状态" :value="props.orders.status" />
              <common-cell label="订单来源" :value="showSource(props.orders.source)" />
              <common-cell label="收银员" :value="props.orders.cashier?.nickname" />
              <common-cell label="收银员手机号" :value="props.orders.cashier?.phone" />
            </div>
          </div>
        </template>
      </sale-cards>
    </div>
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
      <sale-cards title="会员信息">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <common-cell label="姓名" :value="props.orders.member?.name" />
              <common-cell label="昵称" :value="props.orders.member?.nickname" />
              <common-cell label="等级" :value="props.orders.member?.level" />
              <common-cell label="积分" :value="props.orders.member?.integral" />
              <common-cell label="来源" :value="showSource(props.orders.member?.source)" />
              <common-cell label="手机号" :value="props.orders.member?.phone" />
            </div>
          </div>
        </template>
      </sale-cards>
    </div>
    <template v-if="props.orders.products.length">
      <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
        <sale-cards title="商品信息">
          <template #info>
            <div class="grid grid-cols-1 gap-[12px]">
              <div class="info">
                <template v-for="(item, index) in props.orders.products" :key="index">
                  <common-cell label="商品名称" :value="item.product.name" />
                  <common-cell label="折扣" :value="item.discount" />
                  <common-cell label="原价" :value="item.amount_original" />
                  <common-cell label="应付金额" :value="item.amount" />
                  <div class="border-b-solid border-b-[#E0E0E0] border" />
                  <!-- <sale-order-nesting v-model="hasCheck" :title="item.product?.name || ''">
                              <template #left>
                                <common-tags type="pink" text="成品" :is-oval="true" />
                              </template>
                              <template #info>
                                <div class="flex flex-col gap-[12px] px-[16px]">
                                  <div class="grid grid-flow-col w-full place-items-start gap-y-[12px] gap-x-[auto]">
                                    <div class="flex-center-row gap-[8px]">
                                      <div class="text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]">
                                        条码
                                      </div>
                                      <div class="text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]">
                                        {{ item.product?.code }}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                                  <common-cell label="数量" :value="item.quantity" />
                                  <common-cell label="折扣" :value="item.discount || '无'" />
                                  <div class="pb-[16px]">
                                    <div class="flex justify-between items-center">
                                      <div />
                                      <div class="flex">
                                        <div class="item-left">
                                          应付金额：
                                        </div>
                                        <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                                          ￥{{ item.amount }}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </sale-order-nesting> -->
                </template>
              </div>
            </div>
          </template>
        </sale-cards>
      </div>
    </template>
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
      <sale-cards title="结算信息">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <common-cell label="原价" :value="props.orders.amount_original" />
              <common-cell label="应付金额" :value="props.orders.amount" />
              <common-cell label="实付金额" :value="props.orders.amount_pay" />
              <common-cell label="整单折扣" :value="props.orders.discount_rate" />
              <common-cell label="整单折扣金额" :value="props.orders.discount_amount" />
              <common-cell label="抹零金额" :value="props.orders.amount_reduce" />
              <common-cell label="使用积分" :value="props.orders.integral_use" />
              <common-cell label="赠送积分" :value="props.orders.integral_present" />
              <common-cell label="订单备注" :value="props.orders.remark" />
            </div>
          </div>
        </template>
      </sale-cards>
    </div>
    <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
      <sale-cards title="门店信息">
        <template #info>
          <div class="grid grid-cols-1 gap-[12px]">
            <div class="info">
              <common-cell label="门店名称" :value="props.orders.store.name" />
              <common-cell label="联系方式" :value="props.orders.store.contact" />
              <common-cell label="门店地址" :value="props.orders.store.address" />
            </div>
          </div>
        </template>
      </sale-cards>
    </div>
    <template v-if="props.orders.salesmens.length">
      <div class="col-12" uno-sm="col-6" uno-md="col-6" uno-lg="col-4" uno-lt="col-3">
        <sale-cards title="导购员信息">
          <template #info>
            <div class="grid grid-cols-1 gap-[12px]">
              <div class="info">
                <template v-for="(item, index) in props.orders.salesmens" :key="index">
                  <common-cell label="导购员" :value="item.id" />
                  <common-cell label="业绩金额" :value="item.performance_amount" />
                  <common-cell label="是否主导购" :value="isMain(item.is_main)" />
                  <div class="border-b-solid border-b-[#E0E0E0] border" />
                </template>
              </div>
            </div>
          </template>
        </sale-cards>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
 .info {
  --uno: 'flex flex-col gap-[12px] px-[16px] pb-[16px]';
}
</style>
