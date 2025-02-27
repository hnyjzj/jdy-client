<script lang="ts" setup>
const { myStore, myStoreList } = storeToRefs(useStores())
const { getMyStore, switchStore } = useStores()
const { $toast } = useNuxtApp()
const columns = ref()
if (!myStoreList.value.length) {
  await getMyStore({ page: 1, limit: 20 })
}
const choiceStore = () => {
  columns.value = []
  if (!myStoreList.value.length) {
    $toast.error('暂未分配门店')
  }
  myStoreList.value.forEach((item: Stores) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}
// 切换门店
const handleSelect = (id: Stores['id']) => {
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
  }
}
</script>

<template>
  <div>
    <div class="pb-[16px]">
      <div class="blur-bgc rounded-[16px] py-[8px] px-[16px] flex-between items-center">
        <div class="flex-1 dark:color-[#fff]">
          {{ myStore.name }}
        </div>
        <n-dropdown trigger="click" :options="columns" @select="handleSelect">
          <div class="bg-[#0068FF] py-[10px] px-[16px] rounded-[40px] color-[#fff] flex items-center w-auto" @click="choiceStore">
            <icon name="i-icon:product-toggle" :size="16" /> <div class="pl-[4px]">
              切换门店
            </div>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
