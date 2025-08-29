<script lang="ts" setup>
const emits = defineEmits<{
  getlist: []
}>()
const { filterList, title, stockList } = storeToRefs(useStock())
const radioValueFinsihed = defineModel<Revenue['type']>({ default: 1 })
</script>

<template>
  <div>
    <summary-stock-table :title="title" :stock-list="stockList">
      <template #header-title>
        成品统计
      </template>
      <template #header-right>
        <n-radio-group
          v-model:value="radioValueFinsihed" name="radiogroup" @update:value="emits('getlist')">
          <n-radio
            v-for="(item, index) in filterList?.type?.preset" :key="item" :value="Number(index)" :style="{
              '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
              '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
              '--n-dot-color-active': '#0068ff',
              '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
            {{ item }}
          </n-radio>
        </n-radio-group>
      </template>
    </summary-stock-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
