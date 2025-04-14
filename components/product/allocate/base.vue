<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  info: Allocate
  filterList: Where<Allocate>
  productList: T[]
}>()
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
                  {{ props.info.operator?.nickname }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  调拨单号
                </div>
                <div class="info-val">
                  {{ props.info.id }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  状态
                </div>
                <div class="info-val">
                  {{ props.filterList.status?.preset[props.info.status] }}
                </div>
              </div>
              <div class="h-0.5 bg-[#E6E6E8]" />
              <div class="other-information flex flex-col gap-1">
                <div class="info-row">
                  <div class="info-title">
                    调出门店
                  </div>
                  <div class="info-val">
                    {{ props.info?.from_store?.name }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    调入门店
                  </div>
                  <div class="info-val">
                    {{ props.info?.to_store?.name }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    调拨方式
                  </div>
                  <div class="info-val">
                    {{ props.filterList.method?.preset[props.info.method] }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    调拨原因
                  </div>
                  <div class="info-val">
                    {{ props.filterList.reason?.preset[props.info.reason] }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    调拨状态
                  </div>
                  <div class="info-val">
                    {{ props.filterList.status?.preset[props.info.status] }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    仓库类型
                  </div>
                  <div class="info-val">
                    {{ props.filterList.type?.preset[props.info.type] }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    备注
                  </div>
                  <div class="info-val">
                    {{ props.info.remark }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    创建时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.info.created_at) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    完成时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(props.info.updated_at) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="h-0.5 bg-[#E6E6E8]" />
            <div class="product-information flex flex-col gap-1">
              <div class="info-row">
                <div class="info-title">
                  总件数
                </div>
                <div class="info-val">
                  {{ productList?.length }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  总金重
                </div>
                <div class="info-val">
                  {{ productList?.reduce((sum, item) => sum + Number(item.weight_metal), 0) ?? 0 }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  总标价
                </div>
                <div class="info-val">
                  {{ productList?.reduce((sum, item) => sum + Number(item.label_price), 0) ?? 0 }}
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
