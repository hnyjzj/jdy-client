<script lang="ts" setup>
const props = defineProps<{
  enterInfo: AccessorieEnter
}>()

/** 入库状态映射 */
const enterStatus = {
  1: '草稿',
  2: '已完成',
  3: '已撤销',
} as const
</script>

<template>
  <div>
    <div class="rounded-6 bg-white w-auto blur-bga top">
      <common-card-info title="基础信息">
        <template #info>
          <div class="flex flex-col gap-4">
            <div class="operation-information flex flex-col gap-1">
              <div class="info-row">
                <div class="info-title">
                  操作人
                </div>
                <div class="info-val">
                  {{ props.enterInfo?.operator?.nickname }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  入库单号
                </div>
                <div class="info-val">
                  {{ props.enterInfo.id }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  所属门店
                </div>
                <div class="info-val">
                  {{ props.enterInfo.store?.name }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  状态
                </div>
                <div class="info-val">
                  {{ enterStatus[props.enterInfo?.status] }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  备注
                </div>
                <div class="info-val">
                  {{ props.enterInfo?.remark }}
                </div>
              </div>
              <div class="other-information flex flex-col gap-1">
                <div class="info-row">
                  <div class="info-title">
                    创建时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.enterInfo?.created_at) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    完成时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.enterInfo?.updated_at) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="line-space" />
            <div class="product-information flex flex-col gap-1">
              <div class="info-row">
                <div class="info-title">
                  数量
                </div>
                <div class="info-val">
                  {{ props.enterInfo?.product_count }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  入库总件数
                </div>
                <div class="info-val">
                  {{ props.enterInfo?.product_total }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-card-info>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-row {
  --uno: 'flex justify-between py-[2px]';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'text-color-light w-70% text-right';
  }
}
</style>
