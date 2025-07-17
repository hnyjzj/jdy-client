<script lang="ts" setup>
useSeoMeta({
  title: '库存统计',
})
const { getStockType, getStockTitle, getStockList, OldGetStockType, OldGetStockTitle, OldGetStockList } = useStock()
const { filterList, title, stockList, oldfilterList, oldtitle, oldstockList } = storeToRefs(useStock())
const tab = ref('product')
const loading = ref(false)

await getStockType()
const value = ref<number>(1)

await getStockTitle()
await getStockList({ type: value.value })

const getData = async () => {
  loading.value = true
  await getStockList({ type: Number(value.value) })
  loading.value = false
}

const oldVal = ref<number>(1)
const getOldData = async () => {
  loading.value = true
  await OldGetStockList({ type: oldVal.value })
  loading.value = false
}

const changeTab = async (val: string) => {
  tab.value = val
  if (val === 'old') {
    await OldGetStockType()
    await OldGetStockTitle()
    await getOldData()
  }
  else {
    await getStockType()
    await getStockTitle()
    await getData()
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-[16px]">
        <div class="flex justify-between items-center py-[12px] text-[#FFF]" />
        <n-tabs type="segment" animated @update:value="changeTab">
          <n-tab-pane name="product" tab="成品">
            <summary-stock-table :title="title" :stock-list="stockList" :loading="loading">
              <template #header>
                <div class="flex justify-between rounded-[4px] p-[20px] pb-0">
                  <div class="text-[16px] font-bold">
                    成品统计
                  </div>
                  <div>
                    <n-radio-group
                      v-model:value="value" name="radiogroup" :disabled="loading" @update:value="getData">
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
          </n-tab-pane>
          <n-tab-pane name="old" tab="旧料">
            <summary-stock-table :title="oldtitle" :stock-list="oldstockList" :loading="loading">
              <template #header>
                <div class="flex justify-between rounded-[4px] p-[20px] pb-0">
                  <div class="text-[16px] font-bold">
                    旧料统计
                  </div>
                  <div>
                    <n-radio-group
                      v-model:value="oldVal" name="radiogroup" :disabled="loading" @update:value="getOldData">
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
          </n-tab-pane>
        </n-tabs>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
