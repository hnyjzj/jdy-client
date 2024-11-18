<script setup lang="ts">
// 销售管理入口页
const isFold = defineModel({ type: Boolean, default: false })

const toggleFold = () => {
  isFold.value = !isFold.value
}

const iconDirection = computed(() => (isFold.value ? 'i-icon:left' : 'i-icon:down'))
</script>

<template>
  <div class="grid-12">
    <div class="px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="bg-opacity-80 bg-white rounded-[16px] dark:bg-[rgba(255,255,255,0.1)] overflow-hidden">
        <!-- header -->
        <div>
          <common-header-gradient title="销售管理">
            <div
              class="flex-center-row justify-items-center gap-[2px] text-[12px] color-[#808089] dark:color-[#fff]" @click="toggleFold()">
              <div>点击{{ isFold ? '展开' : '收起' }}</div>
              <icon :name="iconDirection" size="12px" class="dark:color-[#fff]" />
            </div>
          </common-header-gradient>
        </div>
        <!-- 销售列表项 -->
        <template v-if="!isFold">
          <div class="flex flex-col gap-[24px] py-[16px]">
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                销售
              </div>
              <!-- 分割线 -->
              <div class="line" />
              <div class="sector  grid-rows-2" uno-lg="grid-rows-1">
                <nuxt-link to="/sale/sales/list">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      销售单列表
                    </div>
                  </div>
                </nuxt-link>
                <nuxt-link to="/sale/sales/add">
                  <div class="list flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      新增销售单
                    </div>
                  </div>
                </nuxt-link>
                <nuxt-link to="/sale/sales/details">
                  <div class="list flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      销售明细
                    </div>
                  </div>
                </nuxt-link>
                <nuxt-link to="/sale/sales/refund">
                  <div class="list flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      退货明细
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 订金单列表项 -->
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                订金单
              </div>
              <!-- 分割线 -->
              <div class="line" />
              <div class="sector grid-rows-1">
                <nuxt-link to="/sale/deposit/list">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      订金单列表
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 维修单列表项 -->
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                维修单
              </div>
              <!-- 分割线 -->
              <div class="line" />
              <div class="sector grid-rows-1">
                <nuxt-link to="/sale/repair/list">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      维修单列表
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 收支单列表项 -->
            <div class="flex flex-col gap-[16px] px-4">
              <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                其他收支单
              </div>
              <!-- 分割线 -->
              <div class="line" />
              <div class="sector grid-rows-1">
                <nuxt-link to="/sale/other/list">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      其他收支单
                    </div>
                  </div>
                </nuxt-link>
                <nuxt-link to="/sale/other/info">
                  <div class="flex-center-row gap-[4px]">
                    <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                    <div class="title">
                      新增收支单
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
