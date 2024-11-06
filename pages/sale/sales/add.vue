<script lang="ts" setup>
// 新增销售单
useSeoMeta({
  title: '新增销售单',
})

const goodinfo = ref([
  {
    name: '商品名称',
    num: '',
  },
  {
    name: '配件礼品',
    num: '',
  },
  {
    name: '旧料抵扣',
    num: '',
  },
  {
    name: '优惠金额',
    num: '',
  },
  {
    name: '定金抵扣',
    num: '',
  },
  {
    name: '抵扣积分值',
    num: '',
  },
])
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="pt-[16px]">
        <sale-add-base />
      </div>
      <sale-add-product />
      <sale-add-settlement :goodinfo="goodinfo" />
      <div class="h-[80px]">
        <common-button-bottom confirm-text="开单" cancel-text="取消" />
      </div>
    </div>
  </div>
</template>
