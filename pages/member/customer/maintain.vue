<script setup lang="ts">
useSeoMeta({
  title: '客户维护',
})

const maintenance: CustomerMaintenance[] = [
  {
    userInfo: {
      nickname: '张三',
      phone: '13800138000',
      level: 1,
    },
    type: 2,
    content: '测试内容测试内容',
    staff: '小美',
    staffPhone: '13800138000',
    store: '洛阳某某店',
    createTime: '2023-08-01 12:00:00',
  },
  {
    userInfo: {
      nickname: '邹元标',
      phone: '13800138000',
      level: 1,
    },
    type: 2,
    content: '测试内容测试内容',
    staff: '小美',
    staffPhone: '13800138000',
    store: '洛阳某某店',
    createTime: '2023-08-01 12:00:00',
  },
  {
    userInfo: {
      nickname: '方思明',
      phone: '13800138000',
      level: 1,
    },
    type: 2,
    content: '测试内容测试内容',
    staff: '小美',
    staffPhone: '13800138000',
    store: '洛阳某某店',
    createTime: '2023-08-01 12:00:00',
  },
]

const show = ref(false)

const handleGoInfo = () => {
  jump('/member/lists/info')
}

const handleDelete = () => {
  show.value = !show.value
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="确认删除">
      <div class="flex-center-col gap-[12px] text-[16px] color-[#333] pb-[24px]">
        <span>确认删除该条记录吗？</span>
        <span>删除后不可恢复，请谨慎处理。</span>
      </div>
    </common-model>

    <div class="col-12 flex flex-col gap-[20px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>

      <member-customer-maintain :data="maintenance" @go-info="handleGoInfo" @delete="handleDelete" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
