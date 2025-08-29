<script lang="ts" setup>
const { getStockTitle, getStockList, getStockType } = useStock()
const { filterList, title, stockList } = storeToRefs(useStock())
const value = ref<number>(1)
await getStockTitle()
await getStockType()
await getStockList({ type: value.value })
const getData = async () => {
  await getStockList({ type: Number(value.value) })
}
</script>

<template>
  <div>
    <summary-stock-table :title="title" :stock-list="stockList">
      <template #header>
        <div class="flex justify-between rounded-[4px] p-[20px] pb-0">
          <div class="text-[16px] font-bold">
            成品统计
          </div>
          <div>
            <n-radio-group
              v-model:value="value" name="radiogroup" @update:value="getData">
              <n-radio
                v-for="(item, index) in filterList?.type?.preset" :key="item" :value="Number(index)" :style="{
                  '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                  '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                  '--n-dot-color-active': '#0068ff',
                  '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                {{ item }}
              </n-radio>
            </n-radio-group>
          </div>
        </div>
      </template>
    </summary-stock-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
