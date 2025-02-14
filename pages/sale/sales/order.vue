<script lang="ts" setup>
// 销售单详情
useSeoMeta({
  title: '销售单详情',
})
const { OrderDetail } = storeToRefs(useOrder())
const { getOrderDetail } = useOrder()
const router = useRouter()
const route = useRoute()
if (route.query.id) {
  await getOrderDetail({ id: route.query.id as string })
}
</script>

<template>
  <div>
    <div class="p-[16px] pb-[80px]">
      <sale-order-detail :orders="OrderDetail" />
    </div>
    <div class="footer">
      <div class="grid-12 gap-[12px] px-[16px]">
        <div class="col-6" uno-sm="col-4 offset-2">
          <common-button-rounded
            content="返回" bgc="#fff" color="#000" @button-click="() => {
              router.back()
            }" />
        </div>
      </div>
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
