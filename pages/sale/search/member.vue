<script setup lang="ts">
// 测试数据。待替换
const memberInfo: Partial<Member> = {
  id: '122222',
  nickname: '懒羊羊',
  phone: '19222222222',
  birthday: '0000-01-01',
  gender: 1,
  level: 3,
}

// 搜索会员页
useSeoMeta({
  title: '会员列表',
})

const handleClick = async () => {
  // 跳转到新增会员页
  await navigateTo('/sale/sales/member')
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-[24px] col-12 pt-[24px]" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- 搜索组件 -->
      <div class="search-header flex flex-row gap-[12px] px-[16px]">
        <product-filter-search class="flex-1" />
        <sale-plusminus @button-click="handleClick" />
      </div>
      <!-- 文本信息 -->
      <div class="flex flex-row gap-[4px] items-center color-[#fff] font-size-[14px] px-[16px]">
        <span>搜索结果共</span>
        <span>1312321432535</span>
      </div>
      <!-- 会员卡片(待删除：如果查到信息，则展示会员卡片，否则展示空状态 ) -->
      <div class="px-[16px]">
        <sale-sales-grades :member-info="memberInfo" />
      </div>
      <!-- 操作栏 -->
      <div class="h-[80px]">
        <common-button-bottom confirm-text="确认" cancel-text="取消" />
      </div>
    </div>
  </div>
</template>
