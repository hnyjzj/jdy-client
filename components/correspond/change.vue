<script setup lang="ts">
const props = withDefaults(defineProps<{
  maxHeight?: string
}>(), {
  maxHeight: '400px',
})

const emits = defineEmits<{
  change: [stored: Stores]
}>()
const { $toast } = useNuxtApp()

const { getMyStore } = useStores()
const { myStoreList, myStore } = storeToRefs(useStores())
const columns = ref()
const getList = async () => await getMyStore()

const saveStoreId = ref('')

async function changeStoer() {
  await getList()
  columns.value = []
  if (!myStoreList.value.length) {
    $toast.error('暂未分配门店')
  }
  myStoreList.value.forEach((item: Stores) => {
    columns.value.push({ label: `${item.name}  ${item.alias}`, key: item.id })
  })
}
const selectStore = ref()

function handleSelect(id: Stores['id']) {
  saveStoreId.value = id
  const stored = myStoreList.value.find(item => item.id === id)
  selectStore.value = stored
  if (stored) {
    saveStoreId.value = ''
    emits('change', stored)
  }
}
</script>

<template>
  <div>
    <n-dropdown trigger="click" placement="bottom-start" :options="columns" :style="{ maxHeight: props.maxHeight, overflowY: 'auto' }" @select="handleSelect">
      <div
        class="py-[6px] px-[12px] bg-[#FFFFFF66] border-rd-full h-full flex-center-row shadow-lg cursor-pointer  "
        @click="changeStoer">
        <client-only>
          <div class="store-name font-bold text-size-[14px] mr-[4px]">
            {{ `${selectStore.alias || myStore.alias}` || '选择门店' }}
          </div>
        </client-only>
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

<style lang="scss">
.n-dropdown-option:nth-child(odd) {
  background-color: #fafafa;
}
.n-dropdown-option:nth-child(even) {
  background-color: #ffffff;
}
.n-dropdown-option-body__label {
  display: flex;
  align-items: center;
}
</style>
