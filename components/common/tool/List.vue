<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  total?: number
}>(), {
  total: 0,
})
const emits = defineEmits<{
  height: []
  changeCard: []
}>()
const showtype = defineModel<'table' | 'list'>('showtype')
const railStyle = ({
  checked,
}: {
  focused: boolean
  checked: boolean
}) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#DBDBDB'
  }
  else {
    style.background = '#DBDBDB'
  }
  return style
}
</script>

<template>
  <div class="flex-center-between gap-2 py-[16px]">
    <div class="flex items-center gap-[12px]">
      <div class="text-size-[14px] color-[#fff]">
        共 {{ props.total }} 条
      </div>
    </div>
    <div class="flex items-center gap-[12px]">
      <div @click="emits('height')">
        <product-filter-senior class="color-[#fff]" />
      </div>
      <template v-if="showtype">
        <n-switch
          v-model:value="showtype"
          :rail-style="railStyle"
          size="medium" checked-value="table"
          unchecked-value="list"
          @update:value="emits('changeCard')">
          <template #checked-icon>
            <icon name="i-icon:data" :size="14" color="#666" />
          </template>
          <template #unchecked-icon>
            <icon name="i-icon:list" :size="14" color="#666" />
          </template>
        </n-switch>
      </template>
    </div>
  </div>
</template>
