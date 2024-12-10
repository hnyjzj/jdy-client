<script setup lang="ts">
useSeoMeta({
  title: '会员列表',
})

// 测试数据。待替换
const memberList: MemberInfo[] = [
  {
    id: 1,
    nickname: '',
    compellation: '李女士',
    phone: '15000000000',
    email: '16532000000@qq.com',
    birthday: '1990-01-25',
    gender: 1,
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
    receiving: {
      name: '成为羊',
      address: '杭州市滨江区XXX',
      phone: '19000000000',
    },
    status: 1,
  },
  {
    id: 2,
    nickname: '',
    compellation: '李旻',
    phone: '13799000000',
    email: '16532000000@qq.com',
    birthday: '1990-01-25',
    gender: 1,
    integral: 798798797,
    level: 3,
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
    receiving: {
      name: '成为羊',
      address: '杭州市滨江区XXX',
      phone: '19000000000',
    },
    status: 3,
  },
]

const userJump = () => {
  // 跳转到会员详情页
  jump('/member/lists/info')
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>

      <member-lists-list :info="memberList" @go-info="userJump" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
