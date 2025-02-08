<script setup lang="ts">
useSeoMeta({
  title: '维修单列表',
})

// 测试数据。待替换
const depositList: any[] = [
  {
    num: 'CZ-32493974',
    store: {
      name: '青青草原一号店',
      salesVolume: 100000,
    },
    member: {
      nickname: '张三',
      phone: '13800138000',
      level: 2,
    },
    mainSalesman: '李四',
    goodsInfo: '足金挂坠',
    quantity: 55789,
    realAmount: 25000,
    goodsAmount: 15000,
    discountAmount: '100',
    oldDiscountAmount: '20',
    integral: '32',
    openType: '预定中',
    createTime: '2021-11-11 11:11:11',
    slipStatus: 2,
  },
]

const show = ref(false)
const handleSign = () => {
  show.value = !show.value
}

const backout = ref(false)
const handleBackout = () => {
  backout.value = !backout.value
}

const handleClick = async () => {
// 跳转到维修单详情页
  await navigateTo('/sale/repair/info')
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="标记">
      <div class="flex-center-col gap-[12px] pb-[32px]">
        <div class="top flex-center-row gap-[2px] tips">
          <span>
            标记
          </span>
          <span class="shadow shadow-[0px_4px_0px_0px_rgba(56,101,258,.8)] font-semibold">
            已送出维修
          </span>
        </div>

        <div class="bottom tips">
          门店收货，已送出至 总部 / 工厂 进行维修
        </div>
      </div>
    </common-model>

    <common-model v-model:model-value="backout" :show-ok="true" title="撤销标记">
      <div class="flex-center-col gap-[8px] pb-[32px]">
        <span class="tips">
          确认撤销吗？
        </span>
        <span class="tips">
          撤销后可再次添加标记。
        </span>
      </div>
    </common-model>

    <div class="flex flex-col gap-[20px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <!-- header -->
      <!-- 搜索 -->
      <div class="flex flex-row gap-[12px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <!-- content -->
      <sale-repair-list :info="depositList" @info="handleClick" @sign="handleSign" @cancel="handleBackout" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tips {
  --uno: 'font-size-[14px] color-[#333]';
}
</style>
