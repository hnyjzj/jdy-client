<script setup lang="ts">
const { getMyStore, switchStore } = useStores()
const { myStoreList, newStore } = storeToRefs(useStores())
const columns = ref()
await getMyStore({ page: 1, limit: 20 })
function changeStoer() {
  columns.value = []
  myStoreList.value.forEach((item: storesList) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}

function handleSelect(e: any) {
  const stored = myStoreList.value.find(item => item.id === e)
  if (stored) {
    switchStore({ id: stored.name, name: stored.name })
  }
}
</script>

<template>
  <div>
    <n-dropdown trigger="hover" :options="columns" @select="handleSelect">
      <div class="py-[6px] px-[12px] bg-[#FFFFFF66] border-rd-full flex-center-row shadow-lg cursor-pointer" @click="changeStoer">
        <div class="font-bold text-size-[14px] mr-[4px]">
          {{ newStore.name }}
        </div>
        <icon name="i-icon:product-toggle" size="24" />
      </div>
    </n-dropdown>
  </div>
</template>
