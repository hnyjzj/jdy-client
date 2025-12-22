<script lang="ts" setup>
const props = withDefaults(defineProps<{
  timeWhere?: Where<CashflowWhere> | Where<BossWhere>
  hasStore?: boolean
}>(), {
  hasStore: true,
})
const emits = defineEmits<{
  updateTime: []
  changeStores: []
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
  params.value.endTime = `${endTime.value.split('T')[0]}T23:59:59.000+08:00`
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
  <div>
    <div class="blur-bgc py-[6px] mb-[16px]">
      <common-layout-center>
        <div class="flex justify-between items-center">
          <div>
            <template v-if="props.hasStore">
              <product-manage-company @change="emits('changeStores')" />
            </template>
          </div>
          <div class="w-[124px] pr-[16px]">
            <n-select
              v-model:value="params.duration"
              size="small"
              :style="{
                '--n-color': '#DFE9FF',
              }"
              placeholder="请选择时间"
              clearable
              remote
              :options="optonsToSelect(props.timeWhere?.duration?.preset ?? [])"
              @update:value="selectDuration" />
          </div>
        </div>
        <div />
      </common-layout-center>
    </div>
    <common-layout-center>
      <template v-if="params.duration === 11">
        <div class="flex justify-between gap-[6px] pb-[16px] px-[16px]">
          <div class="flex-1 flex gap-[12px] ">
            <n-date-picker
              v-model:formatted-value="startTime"
              input-readonly
              value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              type="date" placeholder="选择开始时间" round clearable
            />
            <n-date-picker
              v-model:formatted-value="endTime"
              input-readonly
              value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              type="date" placeholder="选择结束时间" round clearable
            />
          </div>
          <common-button-rounded content="搜索" padding="7px 16px" @button-click="cofirmTime" />
        </div>
      </template>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-date-picker) {
  background-color: transparent;
  width: 100%;
}
</style>
