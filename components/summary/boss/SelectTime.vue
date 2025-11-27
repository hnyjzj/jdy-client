<script lang="ts" setup>
const props = defineProps<{
  timeWhere?: Where<CashflowWhere> | Where<BossWhere>
}>()
const emits = defineEmits<{
  updateTime: []
}>()

const params = defineModel<BossWhere>({ default: { } as BossWhere })
const startTime = ref()
const endTime = ref()
// 选择范围
const selectDuration = async () => {
  if (params.value.duration === 11) {
    return
  }
  params.value.startTime = undefined
  params.value.endTime = undefined
  emits('updateTime')
}
// 确定时间
const cofirmTime = async () => {
  if (!startTime.value || !endTime.value)
    return
  params.value.startTime = startTime.value
  params.value.endTime = endTime.value
  emits('updateTime')
}
watch(() => params.value, (newVal) => {
  if (newVal.startTime) {
    startTime.value = newVal.startTime
  }
  if (newVal.endTime) {
    endTime.value = newVal.endTime
  }
}, { immediate: true })
</script>

<template>
  <div class="grid-12 mb-[12px] gap-[12px]">
    <div class="col-12" uno-sm="col-4">
      <n-select
        v-model:value="params.duration"
        placeholder="请选择时间范围"
        clearable
        remote
        :options="optonsToSelect(props.timeWhere?.duration?.preset ?? [])"
        @update:value="selectDuration" />
    </div>
    <div class="col-12" uno-sm="col-8">
      <template v-if="params.duration === 11">
        <div class="grid-12 gap-[6px]">
          <div class="col-10 flex gap-[12px]">
            <n-date-picker
              v-model:formatted-value="startTime"
              input-readonly
              default-time="00:00:00"
              :is-date-disabled="dateDisabled"
              value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              type="datetime" placeholder="选择开始时间" round clearable
            />
            <n-date-picker
              v-model:formatted-value="endTime"
              input-readonly
              default-time="23:59:59"
              :is-date-disabled="dateDisabled"
              value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              type="datetime" placeholder="选择结束时间" round clearable
            />
          </div>
          <div
            class="px-[8px] py-[6px] flex-center-row bg-[#fff] rounded-[20px] color-[#0068FF] col-2 cursor-pointer text-center"
            @click="cofirmTime">
            搜索
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-base-selection:not(.n-base-selection--disabled).n-base-selection--active .n-base-selection-label) {
  background-color: #ffffff3b;
}
:deep(.n-base-selection .n-base-selection__border, .n-base-selection .n-base-selection__state-border) {
  border: 1px solid #ffffff3b;
}
:deep(.n-input) {
  background-color: #ffffff3b;
  border: 1px solid transparent;
}
:deep(.n-input__input-el) {
  color: #fff;
}
:deep(.n-input:not(.n-input--disabled).n-input--focus) {
  color: #fff;
  background-color: #ffffff3b;
}
:deep(.n-date-picker) {
  background-color: transparent;
  width: 100%;
}
:deep(.n-input__state-border) {
  border: 1px solid transparent !important;
}
:deep(.n-input__border) {
  border: 1px solid transparent !important;
}

:deep(.n-date-picker-icon svg) {
  color: #fff;
}
</style>
