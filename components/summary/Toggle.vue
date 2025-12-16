<script lang="ts" setup>
interface Props {
  /** 默认值 'list' | 'chart' */
  modelValue: 'list' | 'chart'
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 'chart',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'list' | 'chart'): void
}>()

// 本地状态
const toggleChart = ref<'list' | 'chart'>(props.modelValue)

// 双向绑定
watch(
  () => props.modelValue,
  (val) => {
    toggleChart.value = val
  },
)
watch(toggleChart, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <div
    class=" text-[14px] font-normal text-[#666666] py-[3px] rounded-[4px] cursor-pointer"
    @click="toggleChart = toggleChart === 'list' ? 'chart' : 'list'">
    <div v-if="toggleChart === 'list'" class="flex gap-[6px]">
      <icon name="i-icon:data-bar-chart" color="#0068FF" :size="16" />
      <span class="text-[14px] text-color">图表</span>
    </div>
    <div v-else class="flex gap-[6px] items-center">
      <icon name="i-icon:data-table-chart" color="#0068FF" :size="16" />
      <span class="text-[14px] text-color">表格</span>
    </div>
  </div>
</template>
