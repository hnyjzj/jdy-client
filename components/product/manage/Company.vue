<script setup lang="ts">
const { $toast } = useNuxtApp()

const { getMyStore, switchStore } = useStores()
const { myStoreList, myStore } = storeToRefs(useStores())
const columns = ref()
if (!myStoreList.value.length) {
  await getMyStore({ page: 1, limit: 20 })
}
function changeStoer() {
  columns.value = []
  if (!myStoreList.value.length) {
    $toast.error('暂未分配门店')
  }
  myStoreList.value.forEach((item: Stores) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}

function handleSelect(id: Stores['id']) {
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
  }
}
</script>

<template>
  <div>
    <n-dropdown trigger="click" placement="bottom-start" :options="columns" @select="handleSelect">
      <div class="py-[6px] px-[12px] bg-[#FFFFFF66] border-rd-full flex-center-row shadow-lg cursor-pointer" @click="changeStoer">
        <div class="store-name font-bold text-size-[14px] mr-[4px] text-[#fff]">
          {{ myStore.name || '选择门店' }}
        </div>
        <icon name="i-icon:product-toggle" :size="24" />
      </div>
    </n-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.store-name {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
