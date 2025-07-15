<script lang="ts" setup>
const { StorePerformance } = homeDataStore()
const { StorePerformanceList } = storeToRefs(homeDataStore())
await StorePerformance({ duration: 'today' })
</script>

<template>
  <div class="grid-12">
    <div class="p-[16px] col-12" uno-md="col-8 offset-2">
      <template v-if="StorePerformanceList">
        <summary-card-boss :store-performance-list="StorePerformanceList" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
