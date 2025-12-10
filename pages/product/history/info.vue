<script lang="ts" setup>
const { getProductHistoryInfo, getHistoryWhere } = useProductManage()
const { getFinishedWhere } = useFinished()
const { historyInfo, historyFilterList } = storeToRefs(useProductManage())
const { finishedFilterListToArray } = storeToRefs(useFinished())

useSeoMeta({
  title: '货品记录详情',
})
const route = useRoute()
const recordId = ref()
async function getInfo() {
  await getProductHistoryInfo(recordId.value)
  await getHistoryWhere()
  await getFinishedWhere()
}
if (route.query.id) {
  recordId.value = route.query.id
  getInfo()
}

type ProductKey = keyof ProductFinisheds
/** 字段是否更新 */
function isUpdate(key: ProductKey) {
  if (!historyInfo.value || !historyInfo.value.new_value || !historyInfo.value.old_value)
    return false
  try {
    return JSON.stringify(historyInfo.value.new_value[key]) !== JSON.stringify(historyInfo.value.old_value[key])
  }
  catch {
    return false
  }
}
</script>

<template>
  <div class="py-6 px-4">
    <common-layout-center>
      <div class="rounded-6 bg-white w-auto blur-bga">
        <common-card-info title="基础信息">
          <template #info>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col">
                <div class="info-row">
                  <div class="info-title">
                    操作
                  </div>
                  <div class="info-val">
                    {{ historyFilterList.action?.preset[historyInfo?.action] || '' }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    原因
                  </div>
                  <div class="info-val">
                    {{ historyInfo?.reason }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    操作时间
                  </div>
                  <div class="info-val">
                    {{ formatTimestampToDateTime(historyInfo?.updated_at) || '' }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    所属门店
                  </div>
                  <div class="info-val">
                    {{ historyInfo.new_value?.store?.name || '' }}
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8] my-4" />
                <div v-if="historyInfo?.new_value" class="flex flex-col" uno-sm="grid grid-cols-[1fr_1fr] gap-x-10">
                  <template v-for="(item, index) in finishedFilterListToArray" :key="index">
                    <template v-if="item.info">
                      <div class="info-row">
                        <div class="info-title">
                          {{ item.label }}
                        </div>
                        <div class="text-color-light" :style="isUpdate(item.name) ? 'color: #FF4D4F' : ''">
                          <template v-if="item.name === 'store_id'">
                            <div class="info-val">
                              {{ historyInfo?.new_value?.store.name || '' }}
                            </div>
                          </template>
                          <template v-else>
                            <template v-if="item.input === 'text' || item.input === 'number' || item.input === 'textarea'">
                              <div class="info-val">
                                {{ historyInfo?.new_value?.[item.name] || '' }}
                              </div>
                            </template>
                            <template v-else-if="item.input === 'select'">
                              <div class="info-val">
                                {{ item.preset[historyInfo?.new_value?.[item.name]] || '' }}
                              </div>
                            </template>
                            <template v-else-if="item.input === 'list'">
                              <div class="info-val">
                                {{ Array.isArray(historyInfo.new_value[item.name]) && historyInfo.new_value[item.name].length ? historyInfo.new_value[item.name].join(',') : '' }}
                              </div>
                            </template>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </common-card-info>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2';
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.info-row {
  --uno: 'flex justify-between py-[2px]';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'w-200px text-right text-color';
  }
}
</style>
