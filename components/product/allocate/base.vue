<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  info: Allocate
  filterListToArray: FilterWhere<Allocate>[]
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
                <template v-for="(item, index) in props.filterListToArray" :key="index">
                  <template v-if="item.name !== 'store_id'">
                    <div class="info-row">
                      <div class="info-title">
                        {{ item.label }}
                      </div>
                      <template v-if="item.input === 'text'">
                        <div class="info-val">
                          {{ props.info[item.name] }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'select'">
                        <div class="info-val">
                          {{ filterList[item.name]?.preset[props.info[item.name] as number] }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'date'">
                        <div v-if="item.name === 'start_time'" class="info-val">
                          {{ formatTimestampToDateTime(props.info.created_at) }}
                        </div>
                        <div v-if="item.name === 'end_time'" class="info-val">
                          {{ formatTimestampToDateTime(props.info.updated_at) }}
                        </div>
                      </template>
                      <template v-else-if="item.input === 'search'">
                        <div v-if="item.name === 'to_store_id'" class="info-val">
                          {{ props.info.to_store?.name }}
                        </div>
                        <div v-if="item.name === 'from_store_id'" class="info-val">
                          {{ props.info.from_store?.name }}
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <div class="h-0.5 bg-[#E6E6E8]" />
            <div class="product-information flex flex-col gap-1">
              <div class="info-row">
                <div class="info-title">
                  调拨件数
                </div>
                <div class="info-val">
                  {{ info.product_count }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  入网费合计
                </div>
                <div class="info-val">
                  {{ info.product_total_access_fee }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  金重合计
                </div>
                <div class="info-val">
                  {{ info.product_total_weight_metal }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  标签价合计
                </div>
                <div class="info-val">
                  {{ info.product_total_label_price }}
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
