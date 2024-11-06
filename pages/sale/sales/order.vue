<script lang="ts" setup>
// 销售单详情
useSeoMeta({
  title: '销售单详情',
})

const nav = ref(['详情', '结算信息', '操作记录'])
const selectNav = ref(0)
function changeNav(i: number) {
  selectNav.value = i
}
const list = ref([
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
  {
    name: '货品',
    value: '0.00',
  },
])

const isFold = ref(true)

const toggleFold = () => {
  isFold.value = !isFold.value
}
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <sale-add-card title="标题" :list="list" />
      <!-- 切换 -->
      <div class="nav">
        <template v-for="(item, index) in nav" :key="index">
          <div class="nav-item" :class="{ active: index === selectNav }" @click="changeNav(index)">
            {{ item }}
          </div>
        </template>
      </div>
      <!-- 产品信息 -->
      <div class="info">
        <!-- header -->
        <common-header-gradient title="产品信息(3)">
          <div @click="toggleFold()">
            <van-icon :name="!isFold ? 'arrow' : 'arrow-down'" size="14" />
          </div>
        </common-header-gradient>
        <!-- info -->
        <template v-if="isFold">
          <div class="flex flex-col gap-[12px] px-[16px] py-[16px]">
            <!-- 成品 -->
            <sale-order-product />
          </div>
        </template>
      </div>
      <!-- 结算信息 -->
      <sale-add-card title="结算信息" :list="list">
        <template #footer>
          <div class="mx-[16px] py-[12px] border-t-solid border-t-[#E6E6E8] border-t-[1px]">
            <div class="flex flex-col items-end gap-[8px]">
              <div class="flex-center-row gap-[4px] text-[16px] font-semibold text-[#FF2F2F]">
                <span>实付金额</span>
                <span>2399.00</span>
              </div>
              <div class="flex-center-row gap-[4px] text-[16px] font-semibold text-[#3971F3]">
                <span>支付方式</span>
                <span>微信支付</span>
              </div>
            </div>
          </div>
        </template>
      </sale-add-card>
      <div class="h-[80px]">
        <common-button-bottom />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  --uno: 'flex justify-around pt-[16px]';

  &-item {
    --uno: 'color-[#333333] font-size-[16px] font-semibold dark:text-[#fff]';
  }

  .active {
    --uno: 'relative';

    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 4px;
      background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    }
  }
}

.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
</style>
