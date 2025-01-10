<script setup lang="ts">
const props = defineProps<{
  data?: any[]
}>()
</script>

<template>
  <div>
    <template v-if="props.data">
      <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
        <template v-for="(item, index) in props.data" :key="index">
          <common-gradient :title="item.orderId" theme="solid">
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
    --uno: 'font-size-[14px] color-[#666]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#333]';
  }
}
</style>
