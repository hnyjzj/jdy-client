<script setup lang="ts">
useSeoMeta({
  title: '会员详情',
})

// 测试数据。待替换
const memberList: MemberInfo = {
  id: 1,
  nickname: '',
  compellation: '李女士',
  phone: '15000000000',
  email: '16532000000@qq.com',
  birthday: '1990-01-25',
  gender: 2,
  integral: 798798797,
  level: 1,
  buyCount: 3,
  isFollow: 1,
  source: '洛阳某某店',
  adviser: '沈易',
  store: 'XXXXXXXXXX',
  totalBuyCount: 9,
  activityCount: 0,
  createTime: '2022-01-01 12:00:00',
  joinTime: '2022-01-01 12:00:00',
  lastVisitTime: '2022-06-29 12:00:00',
  status: 1,
  receiving: {
    name: '成为羊',
    address: '杭州市滨江区XXX',
    phone: '19000000000',
  },
  consumeRecords: [
    {
      time: '2022-06-29 12:00:00',
      orderId: '1239283918723',
      goodsName: '竖领对襟直袖长衫',
      shouldPay: 1231,
      amount: 1,
      status: 1,
      payAmount: 1239182,
      count: 2,
    },
    {
      time: '2022-06-29 12:00:00',
      orderId: '1239283918723',
      goodsName: '商品22222',
      shouldPay: 38931,
      amount: 3,
      status: 2,
      payAmount: 1239182,
      count: 2,
    },
  ],
}
</script>

<template>
  <div>
    <member-lists-info :data="memberList" />
  </div>
</template>

<style scoped lang="scss">
</style>
