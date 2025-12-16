<script lang="ts" setup>
const props = defineProps<{
  correspondIds: Array<string | undefined>
}>()

const { myStoreList, myStore } = storeToRefs(useStores())

const { hasStored, getMyStore, switchStore } = useStores()
const isGoChangestore = ref(false)
const mask = ref(false)
const getList = async () => await getMyStore()

async function changeStoer() {
  await getList()
}

if (props.correspondIds?.length) {
  await hasStored()
  if (!props.correspondIds.filter(Boolean).includes(myStore?.value?.id)) {
    await changeStoer()
    isGoChangestore.value = true
  }
}

function handleSelect(id: Stores['id']) {
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
  }
  mask.value = false
}
</script>

<template>
  <div>
    <common-confirm
      v-model:show="isGoChangestore" icon="none" title="提醒" text="当前门店与操作门店不匹配，是否切换门店?" @submit="() => {
        mask = true
      }" />
    <correspond-select v-model="mask" :stores="myStoreList" :current-store-id="myStore.id" @select="handleSelect" />
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  --uno: 'shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] cursor-pointer shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] py-[6px] px-[44px] text-[16px] font-semibold line-height-[24px] text-center color-[#fff] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-3xl';
}
.cancle {
  --uno: 'shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] cursor-pointer px-[44px] py-[6px] text-[16px] font-semibold mr-2 line-height-[24px] color-[#3971F3] bg-[#fff] rounded-3xl  shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)]';
}
</style>
