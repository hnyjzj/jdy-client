<script lang="ts" setup>
const { myStoreTodaySale, myStoreTodayInventory } = homeDataStore()
const { myStore, myStoreList } = storeToRefs(useStores())
const { getMyStore, switchStore } = useStores()

await getMyStore({ page: 1, limit: 20 })

// 切换门店
const handleSelectFn = async (id: Stores['id']) => {
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
    await myStoreTodaySale({ store_id: myStore.value.id })
    await myStoreTodayInventory({ store_id: myStore.value.id })
  }
}
</script>

<template>
  <div class="grid-12">
    <div class="p-[16px] col-12" uno-md="col-8 offset-2">
      <home-store
        v-model:store="myStore"
        :store-list="myStoreList"
        @handle-select="handleSelectFn"
        @get-store-list="() => {
          getMyStore({ page: 1, limit: 20 })
        }" />
      <summary-card-boss />
      <summary-card-sale />
      <summary-card-inventory />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
