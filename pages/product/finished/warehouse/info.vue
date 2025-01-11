<script setup lang="ts">
// 入库单详情
useSeoMeta({
  title: '入库单详情',
})

// 入库单详情测试使用数据。需删除
const testData: WarehouseReceipt = {
  operator: 'admin',
  num: '123456789',
  type: 1,
  status: 1,
  totalCount: 1,
  totalPrice: 200,
  totalWeight: 18,
  networkAccessFee: 30,
  remark: '备注备注备注备注备注备注备注备注备注备注备注',
  createTime: '2022-01-01 12:00:00',
  completeTime: '2022-01-01 12:00:00',
}
</script>

<template>
  <div class="storage">
    <product-finished-entry :product-storage-info="testData" />
  </div>
</template>
