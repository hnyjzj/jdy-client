<script lang="ts" setup>
// 销售单详情
useSeoMeta({
  title: '维修单详情',
})
const { getMemberWhere } = useMemberManage()
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getRepairOrderDetail, updateRepairOrder, uploadRepairOrderImg, refundRepairOrder, getRepairOrderWhere, operationRepairOrder, cancelRepairOrder, payRepairOrder } = useRepair()
const { repairOrderDetail, repairFilterList } = storeToRefs(useRepair())
const { userinfo } = storeToRefs(useUser())
const { $toast } = useNuxtApp()
const route = useRoute()
const getDetail = async (val?: string) => {
  await getRepairOrderDetail({ id: val || (route.query.id as string) })
}
if (route.query.id) {
  await getDetail(route.query.id as string)
  await getMemberWhere()
  await getFinishedWhere()
}
await getRepairOrderWhere()

// 退款
const refund = async (val: { id: string, remark: string }) => {
  return await refundRepairOrder(val)
}

// 上传图片
const uploadFile = async (file: any) => {
  const { data } = await uploadRepairOrderImg({ image: file || undefined })
  if (data.value?.code !== HttpCode.SUCCESS) {
    $toast.error(data.value?.message || '上传失败')
    return false
  }
  return data.value.data.url
}

// 更新订单
const updateOrder = async (req: updateRepairParams) => {
  return await updateRepairOrder(req)
}
// 操作订单
const operation = async (val: { id: string, operation: number }) => {
  return await operationRepairOrder(val)
}

const cancelOrder = async () => {
  const res = await cancelRepairOrder({ id: route.query.id as string })
  if (res) {
    $toast.success('支付成功')
  }
  else {
    $toast.error('支付失败')
  }
  await getDetail(route.query.id as string)
}
const payOrder = async () => {
  const res = await payRepairOrder({ id: route.query.id as string })
  if (res) {
    $toast.success('支付成功')
  }
  else {
    $toast.error('支付失败')
  }
  await getDetail(route.query.id as string)
}
</script>

<template>
  <div>
    <div class="p-[16px] pb-[80px]">
      <sale-service-info
        :identity="userinfo?.identity"
        :order-where="repairFilterList"
        :detail="repairOrderDetail"
        :get-detail="getDetail"
        :finished-where="finishedFilterList"
        :update-order="updateOrder"
        :upload-file="uploadFile"
        :operation="operation"
        :refund="refund"
      />
      <template v-if="OrderStatusText.OrderSalesProductStatusWaitPay === repairOrderDetail.status">
        <common-confirm-pay @pay="payOrder" @cancle="cancelOrder" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
</style>
