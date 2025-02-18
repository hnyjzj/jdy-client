<script setup lang="ts">
// 盘点单详情
useSeoMeta({
  title: '盘点单详情',
})

// 盘点单详情测试数据。需删除
const testInventory: InventorySheet = {
  num: '1111111233213',
  store: '测试门店',
  scope: '全部商品',
  wareHouse: '主仓',
  brand: '测试品牌',
  operator: 'li',
  supervisor: 'wang',
  shouldCount: 250,
  lossCount: 17,
  profitCount: 50,
  createTime: '2022-01-01 12:00:00',
  inventoryStatus: 2,
  remark: '测试备注测试备注测试备注',
  totalCount: 200,
  totalPrice: 170,
  totalWeight: 20,
  category: '金类',
  refinement: 'xx金',
  technique: 'xx技术',
}
</script>

<template>
  <product-finished-stocktaking :sheet="testInventory" />
</template>
