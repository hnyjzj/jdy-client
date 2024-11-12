<script setup lang="ts">
interface RowData {
  [key: string]: string | number | boolean
}

const props = defineProps<{
  columns: Column[]
  data: RowData[]
  /**
   * 单元格对齐方式
   */
  alignDesc?: ColumnAlign
  /**
   * 是否应用悬停样式
   */
  hover?: boolean
  /**
   * 空状态提示文本
   */
  emptyText?: string
}>()
</script>

<template>
  <div class="m-[16px] m-t-0 min-w-[365px]">
    <slot name="options" />
    <slot />
    <div class="table flex flex-col">
      <template v-if="props.data.length">
        <div class="table-caption flex flex-row bg-[#F1F5FE] px-[16px] py-[12px]" :style="{ textAlign: props.alignDesc ?? 'center' }">
          <template v-for="(item, key) in props.columns" :key="key">
            <div class="flex-1 content-center font-size-[14px] font-semibold text-[#333] justify-self-center">
              {{ item.header }}
            </div>
          </template>
        </div>
        <div class="table-body">
          <div class="table-cell flex flex-col pb-[12px]" :style="{ textAlign: props.alignDesc ?? 'center' }">
            <template v-for="(row, index) in props.data" :key="index">
              <div class="row flex flex-row px-[16px] py-[6px] even:bg-[#F5F5F5] hover:bg-[#EDEDED] even:hover:bg-[#EDEDED]">
                <template v-for="(col, key) in props.columns" :key="key">
                  <div class="flex-1 font-size-[14px] font-medium text-[#333]">
                    {{ row[col.field] }}
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <common-empty :text="props.emptyText || '请先筛选数据'" />
      </template>
    </div>
  </div>
</template>
