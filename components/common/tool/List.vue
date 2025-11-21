<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  total?: number
  isExport?: boolean
}>(), {
  total: 0,
  isExport: false,
})
const emits = defineEmits<{
  height: []
  changeCard: []
  export: []
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
      <div class="text-size-[14px]">
        共 {{ props.total }} 条
      </div>
      <template v-if="isExport">
        <div class="flex items-center cursor-pointer" @click="emits('export')">
          <span class="underline">
            <icon name="i-icon:download" :size="14" />
          </span>
          <span class="px-[8px]">
            导出
          </span>
        </div>
      </template>
    </div>
    <div class="flex items-center gap-[12px]">
      <span class="cursor-pointer">
        <slot />
      </span>
      <div @click="emits('height')">
        <product-filter-senior />
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
