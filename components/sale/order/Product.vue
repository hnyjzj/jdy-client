<script setup lang="ts">
// 测试数据。待替换
const productInfo = [
  {
    name: '条码',
    desc: 's123901287',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
]

const hasCheck = defineModel({ type: Boolean, default: false })
</script>

<template>
  <div>
    <sale-order-nesting v-model="hasCheck" title="成品" :info="productInfo">
      <template #right>
        <common-tags type="pink" text="成品" :is-oval="true" />
      </template>
      <template #info>
        <div class="flex flex-col gap-[12px] px-[16px]">
          <div class="flex flex-row gap-[12px]">
            <common-avatar :size="40" />
            <div class="grid grid-rows-4 grid-flow-col w-full place-items-start gap-y-[12px] gap-x-[auto]">
              <template v-for="(item, index) in productInfo" :key="index">
                <div class="content">
                  <div class="left">
                    {{ item.name }}
                  </div>
                  <div class="right">
                    {{ item.desc }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
          <!-- footer -->
          <div class="footer">
            <div class="item">
              <div class="item-left">
                数量
              </div>
              <div class="item-right">
                x1
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                应付金额
              </div>
              <div class="color-[#FF2F2F] font-size-[14px] font-medium dark:color-[#FF624D]">
                4399.00
              </div>
            </div>
          </div>
        </div>
      </template>
    </sale-order-nesting>
  </div>
</template>

<style scoped lang="scss">
.content {
  --uno: 'flex-center-row gap-[8px]';

  .left {
    --uno: 'text-[14px] font-medium text-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'text-[14px] font-medium text-[#333333] dark:color-[#FFFFFF]';
  }
}

.footer {
  --uno: 'flex-center-between pb-[16px]';

  .item {
    --uno: 'flex-center-row gap-[12px]';

    &-left {
      --uno: 'color-[#666] font-size-[14px] font-medium dark:color-[#CBCDD1]';
    }

    &-right {
      --uno: 'bg-[#F5F5F5] color-[#000] font-size-[14px] font-medium rounded-[24px] border-solid border-1 border-[#E6E6E8] px-[12px] py-[2px] dark:color-[#666666] dark:bg-[rgb(245,245,245,0.5)] dark:border-[rgb(245,245,245,0.5)]';
    }
  }
}
</style>
