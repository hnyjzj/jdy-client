<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

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
  <div class="grid-12 pb-[120px]!">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <img src="/images/banner/work.png" class="w-[200px]">
      </div>
      <home-greet />
      <common-dark />
      <!-- 判断门店是否存在，id为空字符串则是管理员权限，也显示 -->
      <template v-if="myStore.id || myStore.id === ''">
        <home-store
          v-model:store="myStore"
          :store-list="myStoreList"
          @handle-select="handleSelectFn"
          @get-store-list="() => {
            getMyStore({ page: 1, limit: 20 })
          }" />
        <summary-card-boss />
        <home-action />
        <summary-card-sale />
        <summary-card-inventory />
      </template>
      <template v-else>
        <common-emptys text="暂未分配门店" />
      </template>
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>
