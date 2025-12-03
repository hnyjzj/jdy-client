<script setup lang="ts">
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
const changeListType = (type: 'list' | 'table') => {
  showtype.value = type
  emits('changeCard')
}
</script>

<template>
  <div class="flex-center-between gap-2 pb-[16px]">
    <div class="flex items-center gap-[12px]">
      <div class="text-size-[14px] color-[#91929E] font-semibold">
        共 {{ props.total }} 条
      </div>
      <template v-if="isExport">
        <div class="flex items-center cursor-pointer" @click="emits('export')">
          <span class="underline">
            <icon name="i-icon:download" :size="14" color="#3971F3" />
          </span>
          <span class="px-[3px] color-[#3971F3]">
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
        <div class="flex rounded-[2px] overflow-hidden cursor-pointer">
          <div
            class="wh-[24px] flex-center-row"
            :style="{
              background: showtype === 'list' ? '#3971F3' : '#fff',
              border: showtype === 'list' ? 'none' : '1px solid #DBDBDB',
            }" @click="changeListType('list')">
            <icon name="i-icon:view-list" :size="16" :color="showtype === 'list' ? '#fff' : '#666'" />
          </div>
          <div
            class="wh-[24px] flex-center-row"
            :style="{
              background: showtype === 'table' ? '#3971F3' : '#fff',
              border: showtype === 'table' ? 'none' : '1px solid #DBDBDB',
            }" @click="changeListType('table')">
            <icon name="i-icon:view-icon" :size="16" :color="showtype === 'table' ? '#fff' : '#666'" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
