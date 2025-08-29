<script lang="ts" setup>
useSeoMeta({
  title: 'boss看板',
})

// await OldGetStockType()
// await OldGetStockTitle()
// await getOldData()
// await getStockType()
// await getStockTitle()
// await getData()
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-[16px]">
        <div class="flex justify-between items-center py-[12px] text-[#FFF]" />
        <summary-boss-finished />
        <summary-boss-old-product />
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
