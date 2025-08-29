<script lang="ts" setup>
const emits = defineEmits<{
  getlist: []
}>()
const { oldfilterList, oldtitle, oldstockList } = storeToRefs(useStock())
const radioValueOld = defineModel<Revenue['type']>({ default: 1 })
</script>

<template>
  <div>
    <summary-stock-table :title="oldtitle" :stock-list="oldstockList">
      <template #header-title>
        旧料统计
      </template>
      <template #header-right>
        <div>
          <n-radio-group
            v-model:value="radioValueOld" name="radiogroup" @update:value="emits('getlist')">
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
      </template>
    </summary-stock-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
