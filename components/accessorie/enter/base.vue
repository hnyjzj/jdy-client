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

/**
 * 汇总字段总和
 */
function sum(key: string): number {
  return props.enterInfo?.products?.reduce((total, item) => {
    const num = Number(item?.[key])
    return Number.isFinite(num) ? total + num : total
  }, 0) ?? 0
}

function sumCategory(key: string): number {
  return props.enterInfo?.products?.reduce((total, item) => {
    const num = Number(item?.category[key])
    return Number.isFinite(num) ? total + num : total
  }, 0) ?? 0
}
</script>

<template>
  <div>
    <div class="rounded-6 bg-white w-auto blur-bga top">
      <common-gradient title="基础信息">
        <template #body>
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
                  门店
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
                  {{ enterStatus[props.enterInfo.status] }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  备注
                </div>
                <div class="info-val">
                  {{ props.enterInfo.remark }}
                </div>
              </div>
              <div class="other-information flex flex-col gap-1">
                <div class="info-row">
                  <div class="info-title">
                    创建时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.enterInfo.created_at) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    完成时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.enterInfo.updated_at) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="h-0.5 bg-[#E6E6E8]" />
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
                  总重量
                </div>
                <div class="info-val">
                  {{ sumCategory('weight') || 0 }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  总标签价
                </div>
                <div class="info-val">
                  {{ sumCategory('label_price') || 0 }}
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
              <div class="info-row">
                <div class="info-title">
                  入库总入网费
                </div>
                <div class="info-val">
                  {{ sum('access_fee') || 0 }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-row {
  --uno: 'flex justify-between mb-2';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'text-color-light w-70% text-right';
  }
}
</style>
