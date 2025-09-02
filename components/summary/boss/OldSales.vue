<script lang="ts" setup>
const emits = defineEmits<{
  getlist: []
}>()
const { oldSalesFilterList, oldSalesTitle, oldSalesList } = storeToRefs(useStock())
const radioValueOldSale = defineModel<Revenue['type']>({ default: 1 })
</script>

<template>
  <div>
    <summary-stock-table :title="oldSalesTitle" :stock-list="oldSalesList">
      <template #header-title>
        旧料销售
      </template>
      <template #header-right>
        <n-radio-group
          v-model:value="radioValueOldSale" name="radiogroup" @update:value="emits('getlist')">
          <n-radio
            v-for="(item, index) in oldSalesFilterList?.type?.preset" :key="item" :value="Number(index)" :style="{
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
