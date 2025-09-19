<script setup lang="ts">
interface Props {
  /** 项目列表（门店或区域） */
  items?: Array<Stores | Region>
  /** 显示标签 */
  label: string
  /** 无数据时显示的值 */
  emptyValue?: string
  /** 是否显示数量标签 */
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  emptyValue: '无',
  showCount: true,
})

/**
 * 获取项目名称
 * @param item 门店或区域对象
 * @returns 项目名称
 */
const getItemName = (item: Stores | Region): string => {
  return item.name
}

/**
 * 格式化数量显示
 * @param count 剩余数量
 * @returns 格式化后的显示文本
 */
const formatCount = (count: number): string => {
  return `+${count}`
}
</script>

<template>
  <div>
    <template v-if="props.items?.length">
      <div class="flex-between pb-[8px]">
        <div class="color-[#666]">
          {{ props.label }}
        </div>
        <div class="text-align-end w-[60%]">
          <span class="mr-[4px]">
            <n-tag size="small">
              {{ getItemName(props.items[0]) }}
            </n-tag>
          </span>
          <template v-if="props.showCount && props.items.length - 1 > 0">
            <n-tag size="small">
              {{ formatCount(props.items.length - 1) }}
            </n-tag>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <common-cell :label="props.label" :value="props.emptyValue" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
/* 组件样式 */
</style>
