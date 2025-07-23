<script lang="ts" setup>
useSeoMeta({
  title: '收支统计',
})
const { getRevenueWhere, getRevenueTitle, getRevenueList } = useStock()
const { RevenueWhere, RevenueTitle, RevenueList } = storeToRefs(useStock())

const loading = ref(false)
const startTime = ref()
const endTime = ref()
const duration = ref<number>(1)
const radioVal = ref<number>(1)
const params = ref({
  type: 1,
} as Revenue)
await getRevenueWhere()
await getRevenueTitle()
params.value.duration = duration.value
await getRevenueList(params.value)

const getData = async () => {
  loading.value = true
  params.value.type = radioVal.value
  await getRevenueList(params.value)
  loading.value = false
}

const selectDuration = async () => {
  if (duration.value === 11) {
    return
  }
  params.value.startTime = undefined
  params.value.endTime = undefined
  loading.value = true
  params.value.duration = duration.value
  await getRevenueList(params.value)
  loading.value = false
}

const cofirmTime = async () => {
  params.value.duration = duration.value
  if (startTime.value && endTime.value) {
    loading.value = true
    params.value.startTime = startTime.value
    params.value.endTime = endTime.value
    await getRevenueList(params.value)
    loading.value = false
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-[16px]">
        <div class="grid-12 mb-[12px] gap-[6px]">
          <div class="col-4">
            <n-select
              v-model:value="duration"
              placeholder="请选择时间范围"
              clearable
              remote
              :options="optonsToSelect(RevenueWhere.duration?.preset)"
              @update:value="selectDuration" />
          </div>
          <div class="col-8 ">
            <template v-if="duration === 11">
              <div class=" flex justify-end gap-[6px]">
                <n-date-picker
                  v-model:formatted-value="startTime"
                  value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择开始时间" round clearable />
                <n-date-picker v-model:formatted-value="endTime" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择结束时间" round clearable />
                <div class="px-[12px] py-[6px] bg-[#fff] rounded-[20px] color-[#0068FF]" @click="cofirmTime">
                  搜索
                </div>
              </div>
            </template>
          </div>
        </div>

        <summary-stock-table :title="RevenueTitle" :stock-list="RevenueList" :loading="loading">
          <template #header>
            <div class="flex justify-between rounded-[4px] p-[20px] pb-0">
              <div class="text-[16px] font-bold">
                收支统计
              </div>
              <div>
                <n-radio-group
                  v-model:value="radioVal" name="radiogroup" :disabled="loading" @update:value="getData">
                  <n-radio
                    v-for="(item, index) in RevenueWhere?.type?.preset" :key="item" :value="Number(index)" :style="{
                      '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                      '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                      '--n-dot-color-active': '#0068ff',
                      '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                    {{ item }}
                  </n-radio>
                </n-radio-group>
              </div>
            </div>
          </template>
        </summary-stock-table>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
