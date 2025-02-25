<script lang="ts" setup>
const { StorePerformance } = homeDataStore()
const { StorePerformanceList } = storeToRefs(homeDataStore())
await StorePerformance({ duration: 'today' })
</script>

<template>
  <div class="p-[16px]">
    <work-card-digitalization left-title="BOSS看板" :list="StorePerformanceList" />
  </div>
</template>

<style lang="scss" scoped>

</style>
