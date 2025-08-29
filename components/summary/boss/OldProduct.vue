<script lang="ts" setup>
const { OldGetStockType, OldGetStockTitle, OldGetStockList } = useStock()
const { oldfilterList, oldtitle, oldstockList } = storeToRefs(useStock())
const oldVal = ref<number>(1)
const getOldData = async () => {
  await OldGetStockList({ type: oldVal.value })
}
await OldGetStockType()
await OldGetStockTitle()
await getOldData()
</script>

<template>
  <div>
    <summary-stock-table :title="oldtitle" :stock-list="oldstockList">
      <template #header>
        <div class="flex justify-between rounded-[4px] p-[20px] pb-0">
          <div class="text-[16px] font-bold">
            旧料统计
          </div>
          <div>
            <n-radio-group
              v-model:value="oldVal" name="radiogroup" @update:value="getOldData">
              <n-radio
                v-for="(item, index) in oldfilterList?.type?.preset" :key="item" :value="Number(index)" :style="{
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
