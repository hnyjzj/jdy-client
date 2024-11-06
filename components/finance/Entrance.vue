<script setup lang="ts">
// 财务管理入口页
const isFold = defineModel({ type: Boolean, default: false })

const toggleFold = () => {
  isFold.value = !isFold.value
}
</script>

<template>
  <div class="grid-12">
    <div class="px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="bg-opacity-80 bg-white rounded-[16px] dark:bg-[rgba(255,255,255,0.1)]">
        <!-- header -->
        <div>
          <common-header-gradient title="财务管理">
            <div
              class="flex-center-row gap-[2px] text-[12px] color-[#808089] dark:color-[#fff]" @click="toggleFold()">
              <div>点击{{ isFold ? '展开' : '收起' }}</div>
              <icon name="i-icon:down" size="12px" class="dark:color-[#fff]" />
            </div>
          </common-header-gradient>
        </div>
        <!-- 财务列表项 -->
        <template v-if="!isFold">
          <div class="flex flex-col gap-[24px] py-[16px]">
            <!-- 收支 -->
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                收支
              </div>
              <div class="line" />
              <div class="sector grid-cols-1" uno-lg="grid-rows-1">
                <nuxt-link to="/finance/income/list">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      收支对账表
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 业绩 -->
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                业绩
              </div>
              <div class="line" />
              <div class="sector grid-rows-1" uno-lg="grid-rows-1">
                <nuxt-link to="/finance/achievement/summary">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      业绩汇总
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  --uno: 'text-[12px] color-[#333] font-medium dark:color-[#fff]';
}

.sector {
  --uno: 'grid grid-flow-col w-full place-items-start gap-[16px]';
}

.line {
  --uno: 'h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]';
}
</style>
