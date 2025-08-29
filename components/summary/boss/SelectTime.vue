<script lang="ts" setup>
const emits = defineEmits<{
  updateTime: []
}>()
const { RevenueWhere } = storeToRefs(useStock())
const startTime = ref()
const endTime = ref()
const params = defineModel<Revenue>({ default: { duration: 1 } as Revenue })
const duration = ref<number>(1)
// 选择范围
const selectDuration = async () => {
  if (duration.value === 11) {
    return
  }
  params.value.duration = duration.value
  params.value.startTime = undefined
  params.value.endTime = undefined
  emits('updateTime')
}
// 确定时间
const cofirmTime = async () => {
  params.value.duration = duration.value
  if (startTime.value && endTime.value) {
    params.value.startTime = startTime.value
    params.value.endTime = endTime.value
  }
  emits('updateTime')
}
</script>

<template>
  <div class="grid-12 mb-[12px] gap-[6px]">
    <div class="col-4" uno-sm="col-4">
      <n-select
        v-model:value="duration"
        placeholder="请选择时间范围"
        clearable
        remote
        :options="optonsToSelect(RevenueWhere.duration?.preset)"
        @update:value="selectDuration" />
    </div>
    <div class="col-12" uno-sm="col-8">
      <template v-if="duration === 11">
        <div class="grid-12 gap-[6px]">
          <div class="col-10 flex gap-[12px]">
            <n-date-picker
              v-model:formatted-value="startTime"
              input-readonly
              value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择开始时间" round clearable />
            <n-date-picker v-model:formatted-value="endTime" input-readonly value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" type="datetime" placeholder="选择结束时间" round clearable />
          </div>
          <div class="px-[8px] py-[6px] bg-[#fff] rounded-[20px] color-[#0068FF] col-2  text-center" @click="cofirmTime">
            搜索
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
