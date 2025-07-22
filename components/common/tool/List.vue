<script setup lang="ts">
const props = withDefaults(defineProps<{
  total?: number
}>(), {
  total: 0,
})
const emits = defineEmits<{
  height: []
}>()
const showtype = defineModel<'table' | 'list'>()
</script>

<template>
  <div class="flex-center-between gap-2 py-[16px]">
    <div class="flex items-center gap-[12px]">
      <div class="text-size-[14px] color-[#fff]">
        共{{ props.total }}条数据
      </div>
      <template v-if="showtype">
        <div
          class="px-[8px] py-[4px] bg-[#fff] color-[#2775EE] text-center rounded-[20px] cursor-pointer"
          @click="showtype = showtype === 'list' ? 'table' : 'list'">
          {{ showtype === 'list' ? '切换表格' : '切换列表' }}
        </div>
      </template>
    </div>
    <div @click="emits('height')">
      <product-filter-senior class="color-[#fff]" />
    </div>
  </div>
</template>
