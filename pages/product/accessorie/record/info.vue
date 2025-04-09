<script lang="ts" setup>
const { getProductHistoryInfo, getHistoryWhere } = useAcessorieRecord()
const { historyInfo, historyFilterList } = storeToRefs(useAcessorieRecord())
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()
useSeoMeta({
  title: '配件记录详情',
})
const route = useRoute()
const recordId = ref()
async function getInfo() {
  await getProductHistoryInfo(recordId.value)
  await getHistoryWhere()
  await getAccessorieCategoryWhere()
}
if (route.query.id) {
  recordId.value = route.query.id
  getInfo()
}
</script>

<template>
  <div class="py-6 px-4">
    <div class="rounded-6 bg-white w-auto blur-bga top">
      <common-gradient title="基础信息">
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="operation-information flex flex-col gap-1">
              <div class="info-row">
                <div class="info-title">
                  操作
                </div>
                <div class="info-val">
                  {{ historyFilterList.action?.preset[historyInfo.action] || '' }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  关联单号
                </div>
                <div class="info-val">
                  {{ historyInfo.source_id }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-title">
                  操作时间
                </div>
                <div class="info-val">
                  {{ formatTimestampToDateTime(historyInfo.updated_at) }}
                </div>
              </div>
              <div class="h-0.5 bg-[#E6E6E8]" />
              <div class="other-information flex flex-col" uno-sm="grid grid-cols-[1fr_1fr] gap-x-10">
                <accessorie-record-table :filter-list="categoryFilterListToArray" :new-accessories="historyInfo?.new_value?.product ? historyInfo.new_value.product : historyInfo.new_value" :old-accessories="historyInfo?.old_value?.product ? historyInfo.old_value.product : historyInfo.old_value" />
              </div>
            </div>
          </div>
        </template>
      </common-gradient>
    </div>
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
  --uno: 'flex justify-between mb-2';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'w-200px text-right';
  }
}
</style>
