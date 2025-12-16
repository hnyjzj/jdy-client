<script setup lang="ts" generic="T extends Record<string, any>">
const props = defineProps<{
  info: T
  filterList: Where<T>
  filterListToArray: FilterWhere<T>[]
  store?: string
  productType?: GoodsType
}>()
</script>

<template>
  <common-card-info :title="props.info.name ?? ''">
    <template #status>
      <template v-if="info?.status">
        <common-button-status :bg-color="getStatusStyle(info.status, GoodsStatusColorMap).backgroundColor" :text="GoodsStatusMap[info.status as GoodsStatus]" />
      </template>
    </template>
    <template #info>
      <div class="whitespace-nowrap overflow-x-auto flex gap-4" style=" ">
        <template v-for="(img, index) in info.images" :key="index">
          <n-image
            :src="ImageUrl(img)"
            width="100"
            height="100"
            class="shrink-0 mb-4"
          />
        </template>
      </div>
      <div class="flex flex-col gap-1" uno-xl="grid grid-cols-[1fr_1fr] gap-x-8">
        <template v-if="productType !== GoodsType.ProductAccessories">
          <div class="flex justify-between text-sm font-normal">
            <div class="text-color-light">
              所属门店
            </div>
            <div class="info-val">
              {{ store || info?.store?.name || '' }}
            </div>
          </div>
        </template>
        <template v-for="(item, index) in props.filterListToArray" :key="index">
          <!-- 配件是使用 info 控制显示 -->
          <template v-if="item.label && item.info && item.name !== 'recycle_source_id'">
            <div class="flex justify-between text-sm font-normal">
              <div class="text-color-light whitespace-nowrap">
                {{ item?.label }}
              </div>
              <div class="info-val">
                <template v-if="item.name === 'recycle_store_id'">
                  {{ props.info.recycle_store?.name ?? '' }}
                </template>
                <template v-else>
                  <template v-if="item.type === 'date'">
                    <span>
                      {{ formatTimestampToDateTime(props.info[item.name]) ?? '' }}
                    </span>
                  </template>
                  <template v-if="item.input === 'select'">
                    <span>
                      {{ filterList[item.name]?.preset[props.info[item.name]] ?? '' }}
                    </span>
                  </template>
                  <template v-else-if="item.input === 'text' || item.input === 'textarea'">
                    <template v-if="item.name === 'store'">
                      <span>
                        {{ props.info.store?.name ?? '' }}
                      </span>
                    </template>
                    <template v-else>
                      <span>
                        {{ props.info[item.name] ?? '' }}
                      </span>
                    </template>
                  </template>
                  <template v-else-if="item.input === 'number'">
                    <span>
                      {{ props.info[item.name] ?? '' }}
                    </span>
                  </template>
                  <template v-else-if="item.input === 'switch'">
                    <span>
                      {{ props.info[item.name] ? '是' : '否' }}
                    </span>
                  </template>
                  <template v-else-if="item.input === 'list'">
                    {{ props.info[item.name]?.length ? props.info[item.name].join(',') : '' }}
                  </template>
                </template>
              </div>
            </div>
          </template>
        </template>
        <div class="flex justify-between text-sm font-normal">
          <div class="text-color-light whitespace-nowrap">
            入库时间
          </div>
          <div class="info-val">
            {{ props.info.enter_time ? formatIsoToDateTime(props.info.enter_time) : '' }}
          </div>
        </div>
        <div class="flex justify-between text-sm font-normal">
          <div class="text-color-light whitespace-nowrap">
            库龄
          </div>
          <div class="info-val">
            {{ getDaysFromToday(props.info.enter_time || '') }}
          </div>
        </div>
      </div>
    </template>
  </common-card-info>
</template>

<style scoped>
.info-val {
  --uno: 'text-color w-[200px] text-right';
  word-break: normal;
  word-break: break-all;
}
</style>
