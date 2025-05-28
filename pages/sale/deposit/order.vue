<script lang="ts" setup>
// 销售单详情
useSeoMeta({
  title: '订金单详情',
})
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getMemberWhere } = useMemberManage()
const { filterList: memberFiler } = storeToRefs(useMemberManage())
const { OrderDetail, filterList } = storeToRefs(useDepositOrder())
const { getOrderDetail, getSaleWhere, returnGoodsDepositOrder } = useDepositOrder()

const route = useRoute()
if (route.query.id) {
  await getOrderDetail({ id: route.query.id as string })
  await getMemberWhere()
  await getSaleWhere()
  await getFinishedWhere()
}

const returnGoods = async (req: DepositReturnGoods) => {
  const res = await returnGoodsDepositOrder(req)
  if (res) {
    await getOrderDetail({ id: route.query.id as string })
  }

  return res
}
</script>

<template>
  <div>
    <div class="p-[16px] pb-[80px]">
      <sale-deposit-details :member-filer="memberFiler" :product-filter="finishedFilterList" :where="filterList" :orders="OrderDetail" :return-goods="returnGoods" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #e6e6e8;
  --uno: 'fixed bottom-0 left-0 block w-full bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px py-3';
}
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
</style>
