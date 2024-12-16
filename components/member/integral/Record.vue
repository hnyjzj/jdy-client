<script setup lang="ts">
const props = defineProps<{
  data?: Integral[]
}>()

const changeReason = {
  1: '销售',
  2: '兑换卡券',
  3: '合并账号',
  4: '后台调整',
  5: '退货',
  6: '积分清零',
  7: '销售抵扣',
  8: '抽奖抵扣',
  9: '系统赠送',
  10: '积分商城兑换礼品',
  11: '积分商城退款',
}
</script>

<template>
  <div>
    <template v-if="props.data">
      <div class="flex flex-col gap-[16px]">
        <template v-for="(item, index) in props.data" :key="index">
          <common-gradient :title="item.orderId" theme="solid" :foldable="true">
            <template #before>
              <common-avatar :size="16" />
            </template>

            <template #body>
              <div class="flex flex-col gap-[8px]">
                <div class="item">
                  <div class="left">
                    姓名
                  </div>
                  <div class="right">
                    {{ item.userInfo.nickname || '-- --' }}
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    记录类型
                  </div>
                  <div class="right">
                    {{ item.type }}
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    变化原因
                  </div>
                  <div class="right">
                    {{ changeReason[item.reason || 1] }}
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    变化前
                  </div>
                  <div class="right">
                    {{ item.before }}
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    变化后
                  </div>
                  <div class="right">
                    {{ item.after }}
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    创建时间
                  </div>
                  <div class="right">
                    {{ item.createTime }}
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </template>
      </div>
    </template>

    <template v-else>
      <div class="px-[32px] py-[32px]">
        <common-empty size="100%" text="暂无积分记录" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#666666]';
  }
}
</style>
